const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json('endpoint principal')
})

module.exports = app;