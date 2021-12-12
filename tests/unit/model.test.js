const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');
const csv = require('csvtojson');
const fs = require('fs/promises');

const model = require('../../model');

describe('Testando camada de modelo', () => {
  it('Função de recuperação dos dados do CDI', async () => {
    const csvMock = await fs.readFile('./tests/mocks/CDI_Prices.csv', 'utf-8');

    sinon.stub(axios, 'get').resolves({});
    sinon.stub(csv(), 'fromString').resolves(csvMock);

    const CDIHistoryArrayParsed = await model.getCDIHistory();

    expect(CDIHistoryArrayParsed).to.be.an('array');
    expect(CDIHistoryArrayParsed).to.have.length(2493);

    csv().fromString.restore();
    axios.get.restore();
  });
});
