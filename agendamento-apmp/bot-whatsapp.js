/**
 * Bot de lembretes — Psicologia APMP
 * Envia lembrete 2h antes de cada sessão aprovada via WhatsApp (Baileys)
 *
 * Localmente : node bot-whatsapp.js  (sessão salva em ./baileys-session/)
 * Railway    : sessão salva no MongoDB — QR code disponível em <URL>/qr
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const { Boom }    = require('@hapi/boom');
const QRTerminal  = require('qrcode-terminal');
const QRCode      = require('qrcode');
const http        = require('http');
const mongoose    = require('mongoose');
const fs          = require('fs');
const path        = require('path');
const pino        = require('pino');

const { connect }             = require('./lib/db');
const Agendamento             = require('./lib/models/Agendamento');
const { useMongoDBAuthState } = require('./lib/baileysMongoAuth');

// ── Configurações ──────────────────────────────────────────────────────────
const INTERVALO_MS     = 30 * 60 * 1000;  // 30 min
const JANELA_MIN_ANTES = 110;             // 1h50
const JANELA_MAX_ANTES = 130;             // 2h10
const SESSION_DIR      = path.join(__dirname, 'baileys-session');
const LOG_FILE         = path.join(__dirname, 'bot-whatsapp.log');
const PORT             = process.env.PORT || 3001;
const NO_RAILWAY       = !process.env.RAILWAY_ENVIRONMENT;

// ── Logger ─────────────────────────────────────────────────────────────────
function log(nivel, msg) {
  const linha = `[${new Date().toISOString()}] [${nivel.toUpperCase()}] ${msg}`;
  console.log(linha);
  try { fs.appendFileSync(LOG_FILE, linha + '\n', 'utf8'); } catch {}
}
const info  = msg => log('info',  msg);
const erro  = msg => log('erro',  msg);
const aviso = msg => log('aviso', msg);

// ── Estado global ──────────────────────────────────────────────────────────
let sock         = null;
let pronto       = false;
let qrAtual      = null;
let statusBot    = 'aguardando';

// ── Servidor HTTP (QR code + healthcheck para Railway) ─────────────────────
function iniciarServidor() {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/qr' && qrAtual) {
      try {
        const img = await QRCode.toBuffer(qrAtual, { width: 300 });
        res.writeHead(200, { 'Content-Type': 'image/png' });
        return res.end(img);
      } catch {
        res.writeHead(500); return res.end('Erro ao gerar QR');
      }
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    if (statusBot === 'conectado') {
      res.end(`<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h1>✅ Bot APMP ativo</h1>
        <p>WhatsApp conectado. Lembretes sendo enviados automaticamente.</p>
      </body></html>`);
    } else if (qrAtual) {
      res.end(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="30"></head>
        <body style="font-family:sans-serif;text-align:center;padding:40px">
        <h2>📱 Escaneie o QR code para ativar o bot</h2>
        <img src="/qr" style="width:280px;border:1px solid #ccc;border-radius:8px"><br><br>
        <p><strong>WhatsApp</strong> → Menu (⋮) → <strong>Aparelhos conectados</strong> → Conectar aparelho</p>
        <p style="color:#888;font-size:13px">A página atualiza automaticamente a cada 30s.</p>
      </body></html>`);
    } else {
      res.end(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="3"></head>
        <body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2>⏳ Iniciando bot...</h2><p>Aguarde o QR code aparecer.</p>
      </body></html>`);
    }
  });

  server.listen(PORT, () => info(`Servidor HTTP na porta ${PORT} — QR em /qr`));
}

// ── Auth state (local vs Railway) ──────────────────────────────────────────
async function obterAuthState() {
  if (NO_RAILWAY) {
    info('Modo local — sessão em ./baileys-session/');
    return useMultiFileAuthState(SESSION_DIR);
  }
  info('Modo Railway — sessão no MongoDB');
  return useMongoDBAuthState();
}

// ── Conexão WhatsApp ───────────────────────────────────────────────────────
async function conectar() {
  const { state, saveCreds } = await obterAuthState();
  const { version }          = await fetchLatestBaileysVersion();
  info(`Protocolo WA v${version.join('.')}`);

  sock = makeWASocket({
    version,
    auth:    state,
    logger:  pino({ level: 'silent' }),
    browser: ['APMP-Bot', 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ qr, connection, lastDisconnect }) => {
    if (qr) {
      qrAtual   = qr;
      statusBot = 'aguardando_qr';
      if (NO_RAILWAY) {
        console.log('\n📱 Escaneie o QR code (WhatsApp → Aparelhos conectados):\n');
        QRTerminal.generate(qr, { small: true });
      } else {
        info(`QR disponível em: https://<sua-url-railway>/qr`);
      }
      info('Aguardando escaneamento do QR code...');
    }

    if (connection === 'open') {
      qrAtual   = null;
      pronto    = true;
      statusBot = 'conectado';
      info('WhatsApp conectado. Bot ativo.');
    }

    if (connection === 'close') {
      pronto    = false;
      statusBot = 'desconectado';
      const cod       = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const deslogado = cod === DisconnectReason.loggedOut;
      aviso(`Conexão fechada (${cod}). ${deslogado ? 'Apague a sessão e reinicie.' : 'Reconectando em 10s...'}`);
      if (!deslogado) setTimeout(conectar, 10_000);
    }
  });
}

// ── Mensagem de lembrete ───────────────────────────────────────────────────
function montarMensagem(ag) {
  const tipo    = ag.tipo === 'terapia' ? 'sessão de terapia' : 'reserva de sala';
  const horario = ag.tipo === 'terapia' ? ag.horario : ag.horarioSala;
  return (
    `⏰ *Lembrete — Psicologia APMP*\n\n` +
    `Olá, *${ag.nomeGuerra}*! Sua ${tipo} está agendada para ` +
    `*hoje (${ag.dataFormatada})* às *${horario}*.\n\n` +
    `Não esqueça de avisar ao seu Xerife / Auxiliar antes de sair. 🪖\n\n` +
    `_Mensagem automática — APMP · DAS · PMPE_`
  );
}

// ── Verificação de agendamentos ────────────────────────────────────────────
async function verificar() {
  if (!pronto) { aviso('WhatsApp não conectado — pulando.'); return; }

  info('Verificando agendamentos...');
  try {
    await connect();
    const lista = await Agendamento.find({
      status:  'aprovado',
      zap:     { $exists: true, $ne: '' },
      avisado: { $ne: true },
    }).lean();

    info(`${lista.length} agendamento(s) elegíveis.`);
    const agora = Date.now();

    for (const ag of lista) {
      const horaStr = (ag.tipo === 'terapia' ? ag.horario : ag.horarioSala || '').split(' ')[0];
      if (!horaStr || !ag.dataIso) continue;

      const dataHora = new Date(`${ag.dataIso}T${horaStr}:00`);
      const diffMin  = (dataHora.getTime() - agora) / 60_000;

      if (diffMin >= JANELA_MIN_ANTES && diffMin <= JANELA_MAX_ANTES) {
        info(`Enviando lembrete → ${ag.nomeGuerra} (${ag.dataIso} ${horaStr})`);
        try {
          const jid = `${String(ag.zap).replace(/\D/g, '')}@s.whatsapp.net`;
          await sock.sendMessage(jid, { text: montarMensagem(ag) });
          await Agendamento.updateOne({ _id: ag._id }, { avisado: true, avisadoEm: new Date() });
          info(`✓ Lembrete enviado para ${ag.nomeGuerra}.`);
        } catch (err) {
          erro(`Falha ao enviar para ${ag.nomeGuerra}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    erro(`Erro na verificação: ${err.message}`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.MONGODB_URI) {
    erro('MONGODB_URI não definido — encerrando.');
    process.exit(1);
  }

  info('=== Bot Psicologia APMP iniciando ===');
  info(`Ambiente: ${NO_RAILWAY ? 'local' : 'Railway'}`);
  info(`Intervalo: ${INTERVALO_MS / 60_000} min | Janela: ${JANELA_MIN_ANTES}–${JANELA_MAX_ANTES} min antes`);

  await connect();
  info('MongoDB conectado.');

  iniciarServidor();
  await conectar();

  setTimeout(async () => {
    await verificar();
    setInterval(verificar, INTERVALO_MS);
  }, 15_000);
}

main().catch(err => { erro(`Erro fatal: ${err.message}`); process.exit(1); });
