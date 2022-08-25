const jwt = require('jsonwebtoken');

const handleAuthError = (response) => {
  response.status(401).send({ message: 'Необходима авторизация' });
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
