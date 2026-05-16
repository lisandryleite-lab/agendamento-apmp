const mongoose = require('mongoose');

let cached = null;

async function connect() {
  if (cached && mongoose.connection.readyState === 1) return cached;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não definido nas variáveis de ambiente');
  cached = await mongoose.connect(process.env.MONGODB_URI);
  return cached;
}

module.exports = { connect };
