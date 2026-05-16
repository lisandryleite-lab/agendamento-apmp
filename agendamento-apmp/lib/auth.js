const jwt = require('jsonwebtoken');

function getSecret() {
  return process.env.JWT_SECRET || 'fallback-dev-secret-troque-em-producao';
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
