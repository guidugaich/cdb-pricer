const BAD_REQUEST = 400;

function validateCDBRAte(cdbRate) {
  if (cdbRate < 0) {
    return { valid: false, result: 'taxa deve ser positiva' };
  }

  const decimalRegEx = /^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;

  if (decimalRegEx.test(cdbRate)) {
    return { valid: true, result: { cdbRate: parseFloat(cdbRate) } };
  }

  return { valid: false, result: 'formato da taxa inválido' };
}

function validateDates(investmentDate, currentDate) {
  // https://gist.github.com/m-coding/c96d99558a47d30aef4992c6dd60437a
  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;

  if (!dateRegex.test(investmentDate) || !dateRegex.test(currentDate)) {
    return { valid: false, result: 'formato das datas inválido' };
  }

  if (new Date(investmentDate) >= new Date(currentDate)) {
    return { valid: false, result: 'data de investimento deve ser anterior á atual' };
  }

  return { valid: true, result: { investmentDate, currentDate } };
}

function inputValidation(req, res, next) {
  const { investmentDate, cdbRate, currentDate } = req.query;

  // checks if all fields are sent
  if (!investmentDate || !cdbRate || !currentDate) {
    return res
      .status(BAD_REQUEST)
      .json({ message: 'investmentDate, cdbRate e currentDate são parametros mandatórios' });
  }

  // checks if dates are valid
  const dateValidation = validateDates(investmentDate, currentDate);
  if (!dateValidation.valid) {
    return res.status(BAD_REQUEST).json({ message: dateValidation.result });
  }

  // checks if rate is valid
  const rateValidation = validateCDBRAte(cdbRate);
  if (!rateValidation.valid) {
    return res.status(BAD_REQUEST).json({ message: rateValidation.result });
  }

  req.inputs = { ...dateValidation.result, ...rateValidation.result };

  return next();
}

module.exports = { inputValidation };
