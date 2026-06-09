/**
 * Realoca os agendamentos de terapia da Priscila e da Raine para a próxima
 * QUINTA (11/06/2026), mantendo o horário de cada uma, e marca para o bot
 * enviar o aviso de remarcação.
 *
 * 1) PRÉ-VISUALIZAR (não altera nada):
 *      node realocar-quinta.js
 * 2) APLICAR de verdade:
 *      node realocar-quinta.js confirmar
 *
 * Depois de aplicar, o bot (rodando) envia o aviso em até ~1 min.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
try { require('dns').setServers(['8.8.8.8', '1.1.1.1']); } catch {}

const mongoose    = require('mongoose');
const Agendamento = require('./lib/models/Agendamento');

// Quinta-feira alvo
const ALVO_ISO = '2026-06-11';
const ALVO_FMT = 'Quinta, 11/06/2026';

// Padrões de nome (flexíveis p/ variações de grafia)
const PADROES = [/pri[sc]+y?la/i, /rain*e/i];

const aplicar = process.argv[2] === 'confirmar';

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI não definido.'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  const ativos = await Agendamento.find({
    tipo: 'terapia',
    status: { $in: ['pendente', 'aprovado'] },
  }).lean();

  console.log(`\n=== Agendamentos de terapia ativos (${ativos.length}) ===`);
  ativos.forEach(a => console.log(` - ${a.nomeGuerra} | ${a.dataFormatada || a.dataIso} | ${a.horario || '?'} | ${a.status}`));

  const alvos = ativos.filter(a => PADROES.some(p => p.test(a.nomeGuerra || '')));
  console.log(`\n=== Correspondem a Priscila/Raine (${alvos.length}) ===`);
  alvos.forEach(a => console.log(` → ${a.nomeGuerra}: de [${a.dataFormatada} ${a.horario}] para [${ALVO_FMT} ${a.horario}]`));

  if (alvos.length === 0) {
    console.log('\n⚠️  Nenhum agendamento encontrado para esses nomes. Confira a lista acima e me avise os nomes exatos.');
  } else if (!aplicar) {
    console.log('\n(PRÉ-VISUALIZAÇÃO) Nada foi alterado.');
    console.log('Se a lista acima estiver correta, rode:  node realocar-quinta.js confirmar');
  } else {
    for (const a of alvos) {
      await Agendamento.updateOne(
        { _id: a._id },
        { $set: { dataIso: ALVO_ISO, dataFormatada: ALVO_FMT, remarcadoNotificar: true } }
      );
      console.log(`✓ Remarcado: ${a.nomeGuerra} → ${ALVO_FMT} ${a.horario}`);
    }
    console.log('\n✅ Pronto. O bot enviará o aviso de remarcação em até ~1 min (deixe o bot rodando).');
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error('Erro:', err.message); process.exit(1); });
