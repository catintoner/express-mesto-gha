const User = require('../models/user');

module.exports.getUsers = (request, response) => {
  User.find({})
    .then((users) => {
      response.send({ data: users });
    })
    .catch(() => {
      response.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (request, response) => {
  if (!User[request.params.userId]) {
    response.send({ error: 'Такого пользователя нет' });
    return;
  }
  response.send([request.params._id]);
};

module.exports.createUser = (request, response) => {
  const { name, about, avatar } = request.body;
  User.create({ name, about, avatar })
    .then((user) => {
      response.send({ data: user });
    })
    .catch(() => {
      response.status(500).send({ message: 'Произошла ошибка' });
    });
};
