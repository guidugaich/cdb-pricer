const bodyParser = require('body-parser')

const { getCDIHistory } = require('../model');
const { pricing } = require('../controller')
const { inputValidation } = require('../middlewares/inputValidation');

const app = require('express')()

app.use(bodyParser.json());
app.use(inputValidation)

app.get('/pricing', pricing)

module.exports = app;