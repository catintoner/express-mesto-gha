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
  Card.findById(request.params.cardId)
    .orFail(new Error('errorNotFound'))
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId === request.user._id) {
        Card.deleteOne({ _id: request.params.cardId })
          .then(() => response.send({ message: 'Карточка удалена' }));
      } else {
        throw new Error('errorPermissions');
      }
    })
    .catch((err) => {
      if (err.message === 'errorPermissions') {
        response.status(409).send({ message: `Denied ${err.message}` });
        return;
      }
      if (err.message === 'errorNotFound') {
        response.status(errorNotFound).send({ message: 'Карточка не найдена' });
        return;
      }
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
    .orFail(new Error('notFoundId'))
    .then((card) => {
      response.send({ card });
    })
    .catch((err) => {
      if (err.message === 'notFoundId') {
        response.status(errorNotFound).send({ message: 'Карточка не найдена' });
      }
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
    .orFail(new Error('notFoundId'))
    .then((card) => {
      response.send({ card });
    })
    .catch((err) => {
      if (err.message === 'notFoundId') {
        response.status(errorNotFound).send({ message: 'Карточка не найдена' });
      }
      if (err.name === 'CastError') {
        response.status(errorValidation).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(errorDefault).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
      }
    });
};
