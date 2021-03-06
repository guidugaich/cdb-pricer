const model = require('../model');

function convertYearRateToDaily(yearRate) {
  const dailyRate = (((yearRate / 100) + 1) ** (1 / 252)) - 1;

  return parseFloat(dailyRate.toFixed(8));
}

function checkForValidDateRange(dates, startDate, endDate) {
  // verifica se as datas do request estão disponíveis nos dados
  const datesTime = dates.map((date) => date.getTime());
  const startDateTime = new Date(startDate).getTime();
  const endDateTime = new Date(endDate).getTime();

  const minDateRange = datesTime.reduce((acc, val) => Math.min(acc, val));
  const maxDateRange = datesTime.reduce((acc, val) => Math.max(acc, val));

  if ((startDateTime < minDateRange) || (endDateTime > maxDateRange)) {
    return { valid: false, result: 'Intervalo de datas não disponível' };
  }
  return { valid: true };
}

function getCDIHistoryWithRates(CDIHistory) {
  // adiciona campo com taxa diária á série do CDI
  return CDIHistory.map((obj) => ({
    ...obj,
    dLastTradeDailyRate: convertYearRateToDaily(obj.dLastTradePrice),
  })).reverse();
}

function getAccumulatedRate(CDIWithDailyRates, cdbRate) {
  // recebe a série do CDI com taxas diárias e retorna a série adicionando o campo de taxa acumulada
  const result = CDIWithDailyRates.map((obj, index, array) => {
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
  // retorna objeto da precificação
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
    // formatando o retorno para o formato solicitado pelo desafio
    const date = obj.dtDate.toISOString().slice(0, 10);
    const unitPrice = parseFloat((obj.dAccumRate.toFixed(8) * 1000).toFixed(2));

    return { date, unitPrice };
  });

  return { code: 200, result };
}

module.exports = { pricing };
