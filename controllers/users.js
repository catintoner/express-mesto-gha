const User = require('../models/user');

const { errorNotFound, errorValidation, errorDefault } = require('../utils/constants');

module.exports.getUsers = (request, response) => {
  User.find({})
    .then((users) => {
      response.send({ users });
    })
    .catch((err) => {
      response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};

module.exports.getUserById = (request, response) => {
  User.findById(request.params.userId)
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      response.send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        response.status(errorNotFound).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err.name === 'CastError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.createUser = (request, response) => {
  const { name, about, avatar } = request.body;
  User.create({ name, about, avatar })
    .then((user) => {
      response.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.updateUserProfile = (request, response) => {
  const { name, about } = request.body;
  User.findByIdAndUpdate(request.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      response.send({ user });
    })
    .catch((err) => {
      if (err.message === 'notFoundId') {
        response.status(errorNotFound).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (request, response) => {
  const { avatar } = request.body;
  User.findByIdAndUpdate(request.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFoundId'))
    .then((user) => {
      response.send({ user });
    })
    .catch((err) => {
      if (err.message === 'notFoundId') {
        response.status(errorNotFound).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};
