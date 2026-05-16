const jwt = require('jsonwebtoken');

function getSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  // Sem JWT_SECRET: usa secret aleatório por instância (seguro, mas tokens expiram no cold-start)
  if (!global._jwtFallback) {
    global._jwtFallback = require('crypto').randomBytes(32).toString('hex');
    console.error('[SEGURANÇA] JWT_SECRET não definido — tokens não persistem entre reinicializações');
  }
  return global._jwtFallback;
}

function gerarToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '8h' });
}

function middleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  try {
    req.usuario = jwt.verify(auth.slice(7), getSecret());
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado. Faça login novamente.' });
  }
}

module.exports = { gerarToken, middleware };
