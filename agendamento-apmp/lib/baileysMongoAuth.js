/**
 * Baileys auth state persistido no MongoDB.
 * Substitui useMultiFileAuthState para ambientes sem filesystem persistente (Railway, etc).
 */

const { initAuthCreds } = require('@whiskeysockets/baileys');
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { _id: String, data: mongoose.Schema.Types.Mixed },
  { _id: false }
);
const AuthDoc = mongoose.models.BaileysAuth
  || mongoose.model('BaileysAuth', schema);

// Serializa Buffer → base64 para armazenar no MongoDB
const ser = obj => JSON.parse(JSON.stringify(obj, (_, v) =>
  Buffer.isBuffer(v) ? { _buf: v.toString('base64') } : v
));
const deser = obj => JSON.parse(JSON.stringify(obj), (_, v) =>
  (v && typeof v === 'object' && v._buf) ? Buffer.from(v._buf, 'base64') : v
);

async function readDoc(id) {
  try {
    const doc = await AuthDoc.findById(id).lean();
    return doc ? deser(doc.data) : null;
  } catch { return null; }
}
async function writeDoc(id, data) {
  await AuthDoc.findOneAndUpdate(
    { _id: id },
    { _id: id, data: ser(data) },
    { upsert: true }
  );
}
async function deleteDoc(id) {
  await AuthDoc.deleteOne({ _id: id });
}

async function useMongoDBAuthState() {
  const creds = (await readDoc('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const result = {};
          await Promise.all(ids.map(async id => {
            const val = await readDoc(`key:${type}:${id}`);
            if (val != null) result[id] = val;
          }));
          return result;
        },
        set: async (data) => {
          const tasks = [];
          for (const [type, vals] of Object.entries(data)) {
            for (const [id, val] of Object.entries(vals || {})) {
              const key = `key:${type}:${id}`;
              tasks.push(val != null ? writeDoc(key, val) : deleteDoc(key));
            }
          }
          await Promise.all(tasks);
        }
      }
    },
    saveCreds: () => writeDoc('creds', creds)
  };
}

module.exports = { useMongoDBAuthState };
