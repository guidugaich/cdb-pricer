const model = require('../model')

function convertYearRateToDaily(yearRate) {
  const dailyRate = (((yearRate/100) + 1)**(1/252)) - 1
  
  return parseFloat(dailyRate.toFixed(8))
}

function getCDIHistoryWithRates(CDIHistory) {
  return CDIHistory.map((obj) => {
    return ({
        ...obj,
        dLastTradeDailyRate: convertYearRateToDaily(obj.dLastTradePrice)
    })
  }).reverse()
}

function getAccumulatedRate(CDIWithDailyRates, cdbRate) {
  const result = CDIWithDailyRates.map((obj, index, array) => {
    // return (accum*(1 + val * (cdbRate / 100))).toFixed(16)

    const accumRate = array
      .slice(0, index + 1)
      .reduce((accum, val) => {
        const rate = (1 + parseFloat(val.dLastTradeDailyRate) * (cdbRate / 100) )
        return accum * rate
      }, 1)
      .toFixed(16)
    
    return { ...obj, dAccumRate: parseFloat(accumRate) }
  })

  return result
}


async function pricing(investmentDate, cdbRate, currentDate) {
  const CDIHistory = await model.getCDIHistory()
  
  const pricingDateRange = CDIHistory.filter((obj) => {
    return (new Date(investmentDate) <= obj.dtDate) &&
    (obj.dtDate < new Date(currentDate));
  })

  const CDIWithDailyRates = getCDIHistoryWithRates(pricingDateRange);
  
  const CDIWithAcucmRate = getAccumulatedRate(CDIWithDailyRates, cdbRate)

  return CDIWithAcucmRate.map((obj) => { 
    return { ...obj, dPrice: obj.dAccumRate.toFixed(8) * 1000 }
  })

}

module.exports = { pricing }