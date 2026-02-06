const SUPPORTED = ['en', 'hi'];

function languageMiddleware(req, res, next) {
  const lang = req.headers['x-language'] || 'en';

  req.language = SUPPORTED.includes(lang) ? lang : 'en';
  next();
}

module.exports = { languageMiddleware };
