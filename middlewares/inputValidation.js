const BAD_REQUEST = 400;

function inputValidation(req, res, next) {
  const { investmentDate, cdbRate, currentDate } = req.query;

  // checks if all fields are sent
  if (!investmentDate || !cdbRate || !currentDate) {
    return res.status(BAD_REQUEST).json('investmentDate, cdbRate e currentDate são parametros mandatórios')
  }

  // https://gist.github.com/m-coding/c96d99558a47d30aef4992c6dd60437a
  const dateRegex = /^\d{4}\-\d{1,2}\-\d{1,2}$/

  // checks if data is in correct format
  if (!dateRegex.test(investmentDate) || !dateRegex.test(currentDate)) {
    return res.status(BAD_REQUEST).json('Utilize datas no formato YYYY-MM-DD')
  }

  // checks if date is valid

  next()
}

module.exports = { inputValidation }