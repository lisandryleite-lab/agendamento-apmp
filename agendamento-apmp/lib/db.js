const mongoose = require('mongoose');

// Algumas redes recusam a consulta SRV exigida por mongodb+srv://
// (erro "querySrv ECONNREFUSED"). Forçamos um DNS público que aceita SRV.
try { require('dns').setServers(['8.8.8.8', '1.1.1.1']); } catch {}

let cached = null;

async function connect() {
  if (cached && mongoose.connection.readyState === 1) return cached;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não definido nas variáveis de ambiente');
  cached = await mongoose.connect(process.env.MONGODB_URI);
  return cached;
}

module.exports = { connect };
