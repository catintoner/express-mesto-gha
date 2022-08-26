const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');

const router = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const SERVER_ERROR = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(cookieParser());

app.use('/users', auth, router);

app.use('/cards', auth, cardRouter);

app.use('*', (request, response, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use((err, request, response, next) => {
  if (err.statusCode) {
    response.status(err.statusCode).send({ message: err.message });
  } else {
    response.status(SERVER_ERROR).send({ message: `Произошла ошибка => ${err.message}` });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`its my server on port ${PORT}`);
});
