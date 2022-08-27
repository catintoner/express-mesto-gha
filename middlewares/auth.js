const jwt = require('jsonwebtoken');

const InccorectInfoError = require('../errors/IncorrectInfoError');

const handleAuthError = () => {
  throw new InccorectInfoError('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (request, response, next) => {
  debugger;
  const authorization = request.cookies.jwt;
  debugger;
  if (!authorization) {
    handleAuthError();
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    handleAuthError();
    return;
  }

  request.user = payload;

  next();
};
