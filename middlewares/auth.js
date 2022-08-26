const jwt = require('jsonwebtoken');

const InccorectInfoError = require('../errors/IncorrectInfoError');

const handleAuthError = (response, next) => {
  next(new InccorectInfoError('Необходима авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (request, response, next) => {
  const authorization = request.cookies.jwt;

  if (!authorization) {
    handleAuthError(response);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    handleAuthError(response);
    return;
  }

  request.user = payload;

  next();
};
