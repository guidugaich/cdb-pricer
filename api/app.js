const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.get('/pricing', (req, res) => {
  const { investmentDate, cdbRate, currentDate } = req.query;

  res.status(200).json({ investmentDate, cdbRate: parseFloat(cdbRate) , currentDate })
})

module.exports = app;