const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const auth = require('./middlewares/auth');

const router = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const { errorNotFound } = require('./utils/constants');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((request, response, next) => {
//   request.user = {
//     _id: '62f2df06fed82102df93a16e',
//   };

//   next();
// });

app.post('/signin', auth, login);
app.post('/signup', createUser);

app.use('/users', router);

app.use('/cards', cardRouter);

app.use('*', (request, response) => {
  response.status(errorNotFound).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`its my server on port ${PORT}`);
});
