const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', router);
app.use((request, response, next) => {
  request.user = {
    _id: '62f019d8ee5cebbc7e6d0d64',
  };

  next();
});

app.use('/cards', cardRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`its my server on port ${PORT}`);
});
