const cardRouter = require('express').Router();

const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:cardId', deleteCardById);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
