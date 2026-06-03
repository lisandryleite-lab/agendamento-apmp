/**
 * Migração única — marca todos os agendamentos JÁ EXISTENTES como
 * "notificações já enviadas", para o bot não disparar confirmações/avisos
 * retroativos ao passar a controlar esses envios.
 *
 * Rode UMA VEZ, antes de subir o bot com a nova lógica:
 *   node marcar-enviados.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
try { require('dns').setServers(['8.8.8.8', '1.1.1.1']); } catch {}

const mongoose    = require('mongoose');
const Agendamento = require('./lib/models/Agendamento');

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI não definido.'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  const r = await Agendamento.updateMany(
    {},
    { $set: { avisoRequisicaoEnviado: true, confirmacaoEnviada: true } }
  );
  console.log(`✓ ${r.modifiedCount} agendamento(s) marcados como já notificados.`);

  await mongoose.disconnect();
  console.log('\n✅ Pronto. Agora pode (re)iniciar o bot — só novas solicitações/decisões serão notificadas.');
}

main().catch(err => { console.error('Erro:', err.message); process.exit(1); });
