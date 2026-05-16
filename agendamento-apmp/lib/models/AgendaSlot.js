const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  tipo:   { type: String, enum: ['psico', 'sala'], required: true },
  chave:  { type: String, required: true },
  status: { type: String, enum: ['livre', 'pendente', 'aprovado', 'indisponivel', 'ocupado'], default: 'livre' },
  aluno:  { type: String, trim: true },
  obs:    { type: String, trim: true }
});

schema.index({ tipo: 1, chave: 1 }, { unique: true });

module.exports = mongoose.models.AgendaSlot || mongoose.model('AgendaSlot', schema);
