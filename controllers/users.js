const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { errorNotFound, errorValidation, errorDefault } = require('../utils/constants');

module.exports.login = (request, response) => {
  const { email, password } = request.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      response.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ token });
    })
    .catch((err) => {
      response.status(401).send({ message: err.message });
    });
};

module.exports.getUsers = (request, response) => {
  User.find({})
    .then((users) => {
      response.send({ users });
    })
    .catch((err) => {
      response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};

module.exports.createUser = (request, response) => {
  bcrypt.hash(request.body.password, 10)
    .then((hash) => (
      User.create({
        email: request.body.email,
        password: hash,
      })
    ))
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

module.exports.getUserInfo = (request, response) => {
  User.findById(request.user._id)
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
