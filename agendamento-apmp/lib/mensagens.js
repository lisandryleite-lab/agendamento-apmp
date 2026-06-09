function msgNovaRequisicao({ tipo, nomeGuerra, al, pel, cia, dataFormatada, horario, horarioSala }) {
  const tipoLabel = tipo === 'terapia' ? '🧠 Sessão de Terapia' : '🚪 Reserva de Sala';
  const horarioInfo = tipo === 'terapia' ? horario : horarioSala;
  return `📋 *NOVA SOLICITAÇÃO — PSICOLOGIA APMP*
${tipoLabel}

👤 *Aluno(a):* ${nomeGuerra}
🪖 *AL:* ${al} · *PEL/CIA:* ${pel || '?'} PEL / ${cia}ª CIA

📆 *Data:* ${dataFormatada || '—'}
🕐 *Horário:* ${horarioInfo || '—'}

Acesse o painel administrativo para aprovar ou rejeitar.`;
}

function msgAprovacaoTerapia({ nomeGuerra, dataFormatada, horario }) {
  return `✅ *AGENDAMENTO DE TERAPIA CONFIRMADO*
🧠 _Psicologia APMP — Sessão com o psicólogo Murilo_

Olá ${nomeGuerra}! Sua sessão foi confirmada.

📆 *Data:* ${dataFormatada}
🕐 *Horário:* ${horario}

*PROTOCOLO A — Sessão com o psicólogo da APMP:*
1️⃣ Informe ao seu Xerife
2️⃣ No dia, informe ao Auxiliar/Adjunto da CIA
3️⃣ Verifique com o Adjunto quem irá se armar com a chave na guarda
4️⃣ Após a sessão, devolva a chave à guarda e dê retorno à equipe

🔑 A chave fica na guarda, com o efetivo da guarda, mediante registro.

⚠ Sessão até 50min em horário de aula NÃO conta falta.
🔒 Conteúdo sigiloso (CFP).

Boa sessão! 🪖`;
}

function msgAprovacaoSala({ nomeGuerra, dataFormatada, horarioSala }) {
  return `✅ *RESERVA DE SALA CONFIRMADA*
🚪 _Psicologia APMP — Atendimento online com psicólogo particular_

Olá ${nomeGuerra}! Sua reserva foi confirmada.

📆 *Data:* ${dataFormatada}
🕐 *Horário:* ${horarioSala}

*PROTOCOLO B — Reserva da sala:*
1️⃣ Reserva já confirmada (este zap)
2️⃣ No dia, informe ao Auxiliar/Adjunto da CIA
3️⃣ Verifique com o Adjunto quem irá se armar com a chave na guarda
4️⃣ Após o uso, devolva a sala em ordem (como encontrou) e a chave à guarda

🔑 A chave fica na guarda, com o efetivo da guarda, mediante registro.

Bom uso! 🪖`;
}

function msgRejeicao({ tipo, nomeGuerra, dataFormatada, horario, horarioSala }) {
  const tipoLabel = tipo === 'terapia' ? 'agendamento de terapia' : 'reserva de sala';
  const horarioInfo = tipo === 'terapia' ? horario : horarioSala;
  return `❌ *Solicitação não confirmada — APMP*

Olá ${nomeGuerra}, infelizmente seu ${tipoLabel} para ${dataFormatada} às ${horarioInfo} não pôde ser confirmado no momento.

Entre em contato com o titular da sua CIA para mais informações ou reagende pelo sistema.`;
}

function msgRemarcacao({ nomeGuerra, dataFormatada, horario }) {
  return `🔄 *SESSÃO REMARCADA — Psicologia APMP*
🧠 _Atendimento com o psicólogo Murilo_

Olá ${nomeGuerra}! A partir de agora o psicólogo Murilo atende *somente às quintas-feiras*.

Por isso, sua sessão foi *remarcada* para:
📆 *Data:* ${dataFormatada}
🕐 *Horário:* ${horario}

Se esse novo dia/horário não funcionar para você, responda esta mensagem ou reagende pelo sistema. 🪖

_Mensagem automática — APMP · DAS · PMPE_`;
}

module.exports = { msgNovaRequisicao, msgAprovacaoTerapia, msgAprovacaoSala, msgRejeicao, msgRemarcacao };
