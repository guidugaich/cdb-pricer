const axios = require('axios');
const csv = require('csvtojson');

const CDI_DATA_URL = 'https://gorila-blog.s3-us-west-2.amazonaws.com/CDI_Prices.csv';

function formatDate(date) {
  const formattedDate = `${date.split('/')[2]}-${date.split('/')[1]}-${date.split('/')[0]}`;
  return new Date(formattedDate);
}

async function getCDIHistory() {
  const { data } = await axios.get(CDI_DATA_URL, { responseType: 'blob' });

  const CDIHistoryArray = await csv().fromString(data);

  const CDIHistoryArrayParsed = CDIHistoryArray.map((obj) => (
    { ...obj, dtDate: formatDate(obj.dtDate) }
  ));

  return CDIHistoryArrayParsed;
}

module.exports = {
  getCDIHistory,
};
