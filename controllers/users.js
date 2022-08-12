const User = require('../models/user');

module.exports.getUsers = (request, response) => {
  User.find({})
    .then((users) => {
      response.send({ data: users });
    })
    .catch((err) => {
      response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};

module.exports.getUserById = (request, response) => {
  User.findById(request.params.userId)
    .then((user) => {
      if (user) {
        response.send({ user });
      } else {
        response.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        response.status(400).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.createUser = (request, response) => {
  const { name, about, avatar } = request.body;
  User.create({ name, about, avatar })
    .then((user) => {
      response.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        response.status(400).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.updateUserProfile = (request, response) => {
  const { name, about } = request.body;
  User.findByIdAndUpdate(request.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        response.send({ user });
      } else {
        response.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        response.status(400).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (request, response) => {
  const { avatar } = request.body;
  User.findByIdAndUpdate(request.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        response.send({ user });
      } else {
        response.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        response.status(400).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};
