const service = require('../service');

async function pricing(req, res) {
  const { investmentDate, cdbRate, currentDate } = req.inputs;

  const CDBpricing = await service.pricing(investmentDate, cdbRate, currentDate)

  res.status(200).json({ CDBpricing })
}

module.exports = { pricing }