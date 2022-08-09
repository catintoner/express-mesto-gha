const cardRouter = require('express').Router();

const { getCards, deleteCardById, createCard } = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:cardId', deleteCardById);

module.exports = cardRouter;
