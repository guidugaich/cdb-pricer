const bodyParser = require('body-parser');
const cors = require('cors');

const app = require('express')();

const { pricing } = require('../controller');
const { inputValidation } = require('../middlewares/inputValidation');

app.use(bodyParser.json());
app.use(cors());
app.use(inputValidation);

app.get('/pricing', pricing);

module.exports = app;
