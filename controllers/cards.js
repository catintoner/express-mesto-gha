const Card = require('../models/card');

const { errorNotFound, errorValidation, errorDefault } = require('../utils/constants');

module.exports.getCards = (request, response) => {
  Card.find({})
    .then((cards) => {
      response.send({ cards });
    })
    .catch((err) => {
      response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};

module.exports.deleteCardById = (request, response) => {
  Card.findByIdAndDelete(request.params.cardId)
    .then((card) => {
      if (card) {
        response.send({ message: 'Карточка удалена' });
      } else {
        response.status(errorNotFound).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.createCard = (request, response) => {
  const { name, link } = request.body;
  const owner = request.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      response.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.likeCard = (request, response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $addToSet: { likes: request.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        response.send({ card });
      } else {
        response.status(errorNotFound).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};

module.exports.dislikeCard = (request, response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $pull: { likes: request.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        response.send({ card });
      } else {
        response.status(errorNotFound).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};
