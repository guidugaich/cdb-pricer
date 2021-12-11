const model = require('../model');

function convertYearRateToDaily(yearRate) {
  const dailyRate = (((yearRate / 100) + 1) ** (1 / 252)) - 1;

  return parseFloat(dailyRate.toFixed(8));
}

function checkForValidDateRange(dates, date1, date2) {
  const datesTime = dates.map((date) => date.getTime());
  const date1Time = new Date(date1).getTime();
  const date2Time = new Date(date2).getTime();

  if (!datesTime.includes(date1Time) || !datesTime.includes(date2Time)) {
    return { valid: false, result: 'Intervalo de datas não disponível' };
  }
  return { valid: true };
}

function getCDIHistoryWithRates(CDIHistory) {
  return CDIHistory.map((obj) => ({
    ...obj,
    dLastTradeDailyRate: convertYearRateToDaily(obj.dLastTradePrice),
  })).reverse();
}

function getAccumulatedRate(CDIWithDailyRates, cdbRate) {
  const result = CDIWithDailyRates.map((obj, index, array) => {
    // return (accum*(1 + val * (cdbRate / 100))).toFixed(16)

    const accumRate = array
      .slice(0, index + 1)
      .reduce((accum, val) => {
        const rate = (1 + parseFloat(val.dLastTradeDailyRate) * (cdbRate / 100));
        return accum * rate;
      }, 1)
      .toFixed(16);

    return { ...obj, dAccumRate: parseFloat(accumRate) };
  });

  return result;
}

async function pricing(investmentDate, cdbRate, currentDate) {
  const CDIHistory = await model.getCDIHistory();

  const dateRange = CDIHistory.map((obj) => obj.dtDate);

  const dateRangeValidation = checkForValidDateRange(dateRange, investmentDate, currentDate);

  if (!dateRangeValidation.valid) {
    return { code: 400, message: dateRangeValidation.result };
  }

  const pricingDateRange = CDIHistory.filter((obj) => (
    new Date(investmentDate) <= obj.dtDate) && (obj.dtDate < new Date(currentDate)
  ));

  const CDIWithDailyRates = getCDIHistoryWithRates(pricingDateRange);

  const CDIWithAccumRate = getAccumulatedRate(CDIWithDailyRates, cdbRate);

  const result = CDIWithAccumRate.map((obj) => {
    const date = obj.dtDate.toISOString().slice(0, 10);
    const unitPrice = parseFloat((obj.dAccumRate.toFixed(8) * 1000).toFixed(2));

    return { date, unitPrice };
  });

  return { code: 200, result };
}

module.exports = { pricing };
