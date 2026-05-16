const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  tipo:          { type: String, enum: ['terapia', 'sala'], required: true },
  nomeGuerra:    { type: String, required: true, trim: true },
  al:            { type: String, required: true, trim: true },
  pel:           { type: String, trim: true },
  cia:           { type: String, required: true },
  zap:           { type: String, trim: true },
  observacao:    { type: String, trim: true },
  status:        { type: String, enum: ['pendente', 'aprovado', 'rejeitado'], default: 'pendente' },
  dataIso:       String,
  dataFormatada: String,
  horario:       String,
  horarioSala:   String,
  criadoEm:      { type: Date, default: Date.now },
  decididoEm:    Date
});

schema.index({ status: 1, criadoEm: -1 });
schema.index({ tipo: 1, dataIso: 1 });

module.exports = mongoose.models.Agendamento || mongoose.model('Agendamento', schema);
