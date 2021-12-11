const app = require('express')()
const bodyParser = require('body-parser')

const { getCDIHistory } = require('../model')

app.use(bodyParser.json());

const { inputValidation } = require('../middlewares/inputValidation');

app.use(inputValidation)

app.get('/pricing', async (req, res) => {
  const { investmentDate, cdbRate, currentDate } = req.inputs;

  res.status(200).json({ investmentDate, cdbRate, currentDate })
})

module.exports = app;