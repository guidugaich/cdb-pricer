const service = require('../service');

async function pricing(req, res) {
  const { investmentDate, cdbRate, currentDate } = req.inputs;

  const CDBpricing = await service.pricing(investmentDate, cdbRate, currentDate);

  if (CDBpricing.message) {
    return res.status(CDBpricing.code).json({ message: CDBpricing.message });
  }

  return res.status(CDBpricing.code).json({ data: CDBpricing.result });
}

module.exports = { pricing };
