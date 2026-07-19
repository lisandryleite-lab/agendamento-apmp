require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express   = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');

const { connect }  = require('../lib/db');
const Agendamento  = require('../lib/models/Agendamento');
const AgendaSlot   = require('../lib/models/AgendaSlot');
const { gerarToken, middleware: exigirAuth } = require('../lib/auth');
// WhatsApp (avisos, confirmações e lembretes) é enviado pelo bot-whatsapp.js,
// que monitora o banco. A API apenas grava o status; nada é enviado daqui.

const path = require('path');

const app = express();
app.set('trust proxy', 1);

// CORS restrito ao domínio da Vercel e localhost para dev
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /agendamento-apmp\.vercel\.app$/.test(origin) || /localhost/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error('CORS: origem não permitida'));
    }
  }
}));
app.use(express.json({ limit: '2mb' }));

// Rate limit: máx 10 agendamentos por IP a cada 15 min
const limiterAgendamento = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas solicitações. Aguarde alguns minutos e tente novamente.' }
});
app.use(express.static(path.join(__dirname, '../public')));

// Conecta ao MongoDB em cada request (padrão serverless — conexão é cacheada)
app.use(async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (err) {
    console.error('[DB] Falha de conexão:', err.message);
    res.status(503).json({ erro: 'Serviço temporariamente indisponível. Tente novamente.' });
  }
});

// ─────────────────────────────────────────────
//  AUTENTICAÇÃO
// ─────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body || {};
  const PIN = process.env.ADMIN_PIN || '108108';
  if (!pin || pin !== PIN) {
    return res.status(401).json({ erro: 'PIN incorreto' });
  }
  const token = gerarToken({ papel: 'admin' });
  res.json({ token });
});

// ─────────────────────────────────────────────
//  AGENDAMENTOS
// ─────────────────────────────────────────────

// GET /api/agendamentos — lista todos (admin)
app.get('/api/agendamentos', exigirAuth, async (req, res) => {
  try {
    const filtro = req.query.status ? { status: req.query.status } : {};
    const lista = await Agendamento.find(filtro).sort({ criadoEm: -1 }).lean();
    res.json({ data: lista });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/agendamentos — nova solicitação (público, rate limitado)
app.post('/api/agendamentos', limiterAgendamento, async (req, res) => {
  try {
    const { tipo, nomeGuerra, al, pel, cia, zap, observacao, dataIso, dataFormatada, horario, horarioSala } = req.body;

    if (!tipo || !nomeGuerra || !al || !cia) {
      return res.status(400).json({ erro: 'Campos obrigatórios: tipo, nomeGuerra, al, cia' });
    }

    // Normaliza telefone: garante prefixo 55
    const telefone = zap ? (zap.startsWith('55') ? zap : '55' + zap.replace(/\D/g, '')) : '';

    const agendamento = await Agendamento.create({
      tipo, nomeGuerra, al, pel, cia,
      zap: telefone,
      observacao,
      dataIso, dataFormatada, horario, horarioSala,
      status: 'pendente'
    });

    // O aviso de nova solicitação (→ Lisandry) é enviado pelo bot-whatsapp.js.

    res.status(201).json({ data: { id: agendamento._id } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PATCH /api/agendamentos/:id — aprovar ou rejeitar (admin)
app.patch('/api/agendamentos/:id', exigirAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['aprovado', 'rejeitado', 'nao_compareceu', 'cancelado'].includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }

    const ag = await Agendamento.findByIdAndUpdate(
      req.params.id,
      { status, decididoEm: new Date() },
      { new: true }
    );
    if (!ag) return res.status(404).json({ erro: 'Agendamento não encontrado' });

    // A confirmação/rejeição ao aluno é enviada pelo bot-whatsapp.js, que
    // monitora os agendamentos com status decidido e confirmacaoEnviada=false.

    res.json({ data: ag });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PATCH /api/agendamentos/:id/remarcar — muda data/horário do atendimento (admin)
app.patch('/api/agendamentos/:id/remarcar', exigirAuth, async (req, res) => {
  try {
    const { dataIso, dataFormatada, horario, horarioSala } = req.body;
    if (!dataIso) return res.status(400).json({ erro: 'dataIso obrigatória' });

    const ag = await Agendamento.findById(req.params.id);
    if (!ag) return res.status(404).json({ erro: 'Agendamento não encontrado' });

    ag.dataIso = dataIso;
    if (dataFormatada) ag.dataFormatada = dataFormatada;
    if (ag.tipo === 'terapia') {
      if (horario) ag.horario = horario;
    } else if (horarioSala) {
      ag.horarioSala = horarioSala;
    }
    await ag.save();

    res.json({ data: ag });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ─────────────────────────────────────────────
//  AGENDA DO PSICÓLOGO
// ─────────────────────────────────────────────

// GET /api/agenda/psico?inicio=YYYY-MM-DD
app.get('/api/agenda/psico', async (req, res) => {
  try {
    const inicio = req.query.inicio ? new Date(req.query.inicio + 'T00:00:00') : getSegundaAtual();
    const quinta = dateAdd(inicio, 3);
    const diasIso = [isoDate(quinta)];
    const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    const todasChaves = diasIso.flatMap(d => HORARIOS.map(h => `${d}-${h}`));

    const [slots, ags] = await Promise.all([
      AgendaSlot.find({ tipo: 'psico', chave: { $in: todasChaves } }).lean(),
      Agendamento.find({ tipo: 'terapia', status: { $in: ['pendente', 'aprovado'] }, dataIso: { $in: diasIso } }).lean()
    ]);

    const mapa = {};
    slots.forEach(s => { mapa[s.chave] = { status: s.status, aluno: s.aluno || '' }; });

    // Agendamentos sobrepõem slots manuais
    ags.forEach(ag => {
      const horaBase = ag.horario ? ag.horario.split(' ')[0] : null;
      if (!horaBase || !ag.dataIso) return;
      const chave = `${ag.dataIso}-${horaBase}`;
      mapa[chave] = {
        status: ag.status === 'aprovado' ? 'aprovado' : 'pendente',
        aluno: ag.nomeGuerra,
        agendamentoId: String(ag._id)
      };
    });

    res.json({ data: mapa });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/agenda/psico — edita slot (admin)
app.put('/api/agenda/psico', exigirAuth, async (req, res) => {
  try {
    const { chave, status, aluno } = req.body;
    if (!chave) return res.status(400).json({ erro: 'chave obrigatória' });

    if (status === 'livre') {
      await AgendaSlot.deleteOne({ tipo: 'psico', chave });
    } else {
      await AgendaSlot.findOneAndUpdate(
        { tipo: 'psico', chave },
        { tipo: 'psico', chave, status, aluno: aluno || '' },
        { upsert: true }
      );
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ─────────────────────────────────────────────
//  AGENDA DA SALA
// ─────────────────────────────────────────────

// GET /api/agenda/sala?inicio=YYYY-MM-DD
app.get('/api/agenda/sala', async (req, res) => {
  try {
    const inicio  = req.query.inicio ? new Date(req.query.inicio + 'T00:00:00') : getSegundaAtual();
    const diasIso = Array.from({ length: 7 }, (_, i) => isoDate(dateAdd(inicio, i)));

    const todasChaves = diasIso.flatMap(d => Array.from({ length: 24 }, (_, h) => `${d}-${h}`));

    const [slots, ags] = await Promise.all([
      AgendaSlot.find({ tipo: 'sala', chave: { $in: todasChaves } }).lean(),
      Agendamento.find({ tipo: 'sala', status: { $in: ['pendente', 'aprovado'] }, dataIso: { $in: diasIso } }).lean()
    ]);

    const mapa = {};
    slots.forEach(s => { mapa[s.chave] = { status: s.status, aluno: s.aluno || '', obs: s.obs || '' }; });

    ags.forEach(ag => {
      if (!ag.horarioSala || !ag.dataIso) return;
      const hora  = parseInt(ag.horarioSala.split(':')[0], 10);
      const chave = `${ag.dataIso}-${hora}`;
      mapa[chave] = {
        status: ag.status === 'aprovado' ? 'ocupado' : 'pendente',
        aluno: ag.nomeGuerra,
        agendamentoId: String(ag._id)
      };
    });

    res.json({ data: mapa });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/agenda/sala — edita slot (admin)
app.put('/api/agenda/sala', exigirAuth, async (req, res) => {
  try {
    const { chave, status, aluno, obs } = req.body;
    if (!chave) return res.status(400).json({ erro: 'chave obrigatória' });

    if (status === 'livre') {
      await AgendaSlot.deleteOne({ tipo: 'sala', chave });
    } else {
      await AgendaSlot.findOneAndUpdate(
        { tipo: 'sala', chave },
        { tipo: 'sala', chave, status, aluno: aluno || '', obs: obs || '' },
        { upsert: true }
      );
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ─────────────────────────────────────────────
//  EXPORT / IMPORT (admin)
// ─────────────────────────────────────────────

// GET /api/export
app.get('/api/export', exigirAuth, async (req, res) => {
  try {
    const [pedidos, slots] = await Promise.all([
      Agendamento.find().lean(),
      AgendaSlot.find().lean()
    ]);

    const agendaPsico = {}, agendaSala = {};
    slots.forEach(s => {
      if (s.tipo === 'psico') agendaPsico[s.chave] = { status: s.status, aluno: s.aluno };
      else agendaSala[s.chave] = { status: s.status, aluno: s.aluno, obs: s.obs };
    });

    res.json({ pedidos, agendaPsico, agendaSala, exportadoEm: new Date().toISOString(), versao: '5.0' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/import
app.post('/api/import', exigirAuth, async (req, res) => {
  try {
    const { pedidos, agendaPsico, agendaSala } = req.body;

    if (pedidos && Array.isArray(pedidos)) {
      await Agendamento.deleteMany({});
      const limpos = pedidos.map(({ _id, __v, ...rest }) => rest);
      if (limpos.length) await Agendamento.insertMany(limpos);
    }

    if (agendaPsico && typeof agendaPsico === 'object') {
      await AgendaSlot.deleteMany({ tipo: 'psico' });
      const slots = Object.entries(agendaPsico).map(([chave, v]) => ({
        tipo: 'psico', chave,
        status: typeof v === 'string' ? v : (v.status || 'indisponivel'),
        aluno:  typeof v === 'object' ? (v.aluno || '') : ''
      }));
      if (slots.length) await AgendaSlot.insertMany(slots);
    }

    if (agendaSala && typeof agendaSala === 'object') {
      await AgendaSlot.deleteMany({ tipo: 'sala' });
      const slots = Object.entries(agendaSala).map(([chave, v]) => ({
        tipo: 'sala', chave,
        status: v.status || 'ocupado',
        aluno:  v.aluno || '',
        obs:    v.obs || ''
      }));
      if (slots.length) await AgendaSlot.insertMany(slots);
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ─────────────────────────────────────────────
//  UTILITÁRIOS
// ─────────────────────────────────────────────

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dateAdd(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function getSegundaAtual() {
  const hoje = new Date();
  const diff = hoje.getDay() === 0 ? -6 : 1 - hoje.getDay();
  const seg  = new Date(hoje);
  seg.setDate(hoje.getDate() + diff);
  seg.setHours(0, 0, 0, 0);
  return seg;
}

// Servidor local (desenvolvimento)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`   Admin: http://localhost:${PORT}/admin.html\n`);
  });
}

module.exports = app;
