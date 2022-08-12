const Card = require('../models/card');

module.exports.getCards = (request, response) => {
  Card.find({})
    .then((cards) => {
      response.send({ data: cards });
    })
    .catch((err) => {
      response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};

module.exports.deleteCardById = (request, response) => {
  Card.findByIdAndDelete(request.params.cardId)
    .then(() => {
      response.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      response.status(500).send(`${err.name}: ${err.message}`);
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
        response.status(400).send({ message: 'Указанные данные не корректны' });
      } else {
        response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
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
      response.send({ card });
    })
    .catch((err) => {
      response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};

module.exports.dislikeCard = (request, response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $pull: { likes: request.user._id } },
    { new: true },
  )
    .then((card) => {
      response.send({ card });
    })
    .catch((err) => {
      response.status(500).send({ message: `Упс, похоже, неизвестная ошибка, вот подсказка => ${err.name}: ${err.message}` });
    });
};
