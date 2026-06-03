/**
 * Reset da sessão do bot WhatsApp (Baileys).
 *
 * Use quando o bot ficar preso em "Conexão fechada (código 405)" — sinal de
 * sessão quebrada/desvinculada. Apaga as credenciais e chaves armazenadas para
 * forçar a geração de um QR code novo no próximo start do bot.
 *
 *   node reset-bot-session.js
 *
 * Depois rode o bot novamente (Railway: reinicie o serviço) e escaneie o QR
 * em <URL>/qr  →  WhatsApp → Aparelhos conectados → Conectar aparelho.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Alguns provedores/redes recusam a consulta SRV exigida por mongodb+srv://
// (erro "querySrv ECONNREFUSED"). Forçamos um DNS público que aceita SRV.
try { require('dns').setServers(['8.8.8.8', '1.1.1.1']); } catch {}

const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');

const SESSION_DIR = path.join(__dirname, 'baileys-session');

async function main() {
  // 1) Sessão no MongoDB (usada em produção / Railway)
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection('baileysauths');
    const { deletedCount } = await col.deleteMany({});
    console.log(`✓ MongoDB: ${deletedCount} documento(s) de sessão removido(s) (coleção baileysauths).`);
    await mongoose.disconnect();
  } else {
    console.log('• MONGODB_URI não definido — pulando limpeza no MongoDB.');
  }

  // 2) Sessão local em ./baileys-session/ (usada em modo local)
  if (fs.existsSync(SESSION_DIR)) {
    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
    console.log(`✓ Local: pasta ${SESSION_DIR} removida.`);
  } else {
    console.log('• Pasta baileys-session/ não existe — nada a limpar localmente.');
  }

  console.log('\n✅ Sessão zerada. Reinicie o bot e escaneie o QR code novamente.');
}

main().catch(err => {
  console.error('Erro ao resetar sessão:', err.message);
  process.exit(1);
});
