const bodyParser = require('body-parser');
const app = require('express')();

const { pricing } = require('../controller');
const { inputValidation } = require('../middlewares/inputValidation');

app.use(bodyParser.json());
app.use(inputValidation);

app.get('/pricing', pricing);

module.exports = app;
