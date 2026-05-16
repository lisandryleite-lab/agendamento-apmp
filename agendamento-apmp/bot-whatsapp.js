/**
 * Bot de lembretes — Psicologia APMP
 * Envia lembrete 2h antes de cada sessão aprovada via WhatsApp (Baileys)
 *
 * Uso: node bot-whatsapp.js
 * Na primeira execução, escaneie o QR code com o WhatsApp do responsável.
 * Sessão salva em ./baileys-session/ — não apague a pasta.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom }      = require('@hapi/boom');
const mongoose      = require('mongoose');
const fs            = require('fs');
const path          = require('path');
const pino          = require('pino');

const { connect }   = require('./lib/db');
const Agendamento   = require('./lib/models/Agendamento');

// ── Configurações ──────────────────────────────────────────────────────────
const INTERVALO_MS      = 30 * 60 * 1000;  // verificar a cada 30 min
const JANELA_MIN_ANTES  = 110;              // 1h50
const JANELA_MAX_ANTES  = 130;              // 2h10
const SESSION_DIR       = path.join(__dirname, 'baileys-session');
const LOG_FILE          = path.join(__dirname, 'bot-whatsapp.log');

// ── Logger ─────────────────────────────────────────────────────────────────
function log(nivel, msg) {
  const linha = `[${new Date().toISOString()}] [${nivel.toUpperCase()}] ${msg}`;
  console.log(linha);
  fs.appendFileSync(LOG_FILE, linha + '\n', 'utf8');
}
const info  = msg => log('info',  msg);
const erro  = msg => log('erro',  msg);
const aviso = msg => log('aviso', msg);

// ── Conexão WhatsApp ───────────────────────────────────────────────────────
let sock = null;
let pronto = false;

async function conectar() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth:               state,
    printQRInTerminal:  true,
    logger:             pino({ level: 'silent' }),
    browser:            ['APMP-Bot', 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      pronto = true;
      info('WhatsApp conectado. Bot ativo.');
    }

    if (connection === 'close') {
      pronto = false;
      const cod = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const deslogado = cod === DisconnectReason.loggedOut;
      aviso(`Conexão fechada (código ${cod}). ${deslogado ? 'Apague baileys-session/ e reinicie.' : 'Reconectando em 10s...'}`);
      if (!deslogado) setTimeout(conectar, 10_000);
    }
  });
}

// ── Mensagem de lembrete ───────────────────────────────────────────────────
function montarMensagem(ag) {
  const tipo     = ag.tipo === 'terapia' ? 'sessão de terapia' : 'reserva de sala';
  const horario  = ag.tipo === 'terapia' ? ag.horario : ag.horarioSala;
  return (
    `⏰ *Lembrete — Psicologia APMP*\n\n` +
    `Olá, *${ag.nomeGuerra}*! Sua ${tipo} está agendada para *hoje (${ag.dataFormatada})* às *${horario}*.\n\n` +
    `Não esqueça de avisar ao seu Xerife / Auxiliar antes de sair. 🪖\n\n` +
    `_Mensagem automática — APMP · DAS · PMPE_`
  );
}

async function enviarMensagem(zap, texto) {
  const numero = String(zap).replace(/\D/g, '');
  const jid    = `${numero}@s.whatsapp.net`;
  await sock.sendMessage(jid, { text: texto });
}

// ── Verificação de agendamentos ────────────────────────────────────────────
async function verificar() {
  if (!pronto) {
    aviso('WhatsApp ainda não conectado — pulando verificação.');
    return;
  }

  info('Verificando agendamentos...');

  try {
    await connect();

    // Agendamentos aprovados com WhatsApp, ainda não avisados
    const lista = await Agendamento.find({
      status:  'aprovado',
      zap:     { $exists: true, $ne: '' },
      avisado: { $ne: true },
    }).lean();

    info(`${lista.length} agendamento(s) elegíveis encontrados.`);

    const agora = Date.now();

    for (const ag of lista) {
      // Extrai a hora base ("09:00 às 09:40" → "09:00"  |  "14:00 às 15:00" → "14:00")
      const horaStr = (ag.tipo === 'terapia' ? ag.horario : ag.horarioSala || '').split(' ')[0];
      if (!horaStr || !ag.dataIso) continue;

      const dataHora = new Date(`${ag.dataIso}T${horaStr}:00`);
      const diffMin  = (dataHora.getTime() - agora) / 60_000;

      if (diffMin >= JANELA_MIN_ANTES && diffMin <= JANELA_MAX_ANTES) {
        info(`Enviando lembrete → ${ag.nomeGuerra} (${ag.dataIso} ${horaStr})`);
        try {
          await enviarMensagem(ag.zap, montarMensagem(ag));
          await Agendamento.updateOne(
            { _id: ag._id },
            { avisado: true, avisadoEm: new Date() }
          );
          info(`✓ Lembrete enviado e marcado para ${ag.nomeGuerra}.`);
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
    erro('MONGODB_URI não definido no .env — encerrando.');
    process.exit(1);
  }

  info('=== Bot Psicologia APMP iniciando ===');
  info(`Intervalo de verificação: ${INTERVALO_MS / 60_000} min`);
  info(`Janela de lembrete: entre ${JANELA_MIN_ANTES}min e ${JANELA_MAX_ANTES}min antes da sessão`);
  info('Aguardando QR code ou sessão salva...');

  await conectar();

  // Aguarda 15s para a conexão estabilizar antes da primeira verificação
  setTimeout(async () => {
    await verificar();
    setInterval(verificar, INTERVALO_MS);
  }, 15_000);
}

main().catch(err => {
  erro(`Erro fatal: ${err.message}`);
  process.exit(1);
});
