const service = require('../service');

async function pricing(req, res) {
  const { investmentDate, cdbRate, currentDate } = req.inputs;

  const CDBpricing = await service.pricing(investmentDate, cdbRate, currentDate)

  if (CDBpricing.message) {
    return res.status(CDBpricing.code).json({ message: CDBpricing.message })  
  }
  
  res.status(CDBpricing.code).json(CDBpricing.result)
}

module.exports = { pricing }