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

module.exports.getUserById = (request, response) => {
  User.findById(request.params.userId)
    .then((user) => {
      response.send({ user });
    })
    .catch((err) => {
      response.status(500).send(`${err.name}: ${err.message}`);
    });
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
