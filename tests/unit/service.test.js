const sinon = require('sinon');
const { expect } = require('chai');

const service = require('../../service');
const model = require('../../model');

const CDIMock = require('../mocks/mockCDI').map((obj) => ({ ...obj, dtDate: new Date(obj.dtDate) }));

describe('Testando camada de service', () => {
  describe('Testando função pricing', () => {
    beforeAll(async () => {
      sinon.stub(model, 'getCDIHistory').resolves(CDIMock);
    });

    afterAll(() => {
      model.getCDIHistory.restore();
    });

    it('Quando o intervalo de datas é inválido', async () => {
      const pricing = await service.pricing('2016-11-14', 103.5, '2020-12-31');

      expect(pricing).to.have.property('code');
      expect(pricing).to.have.property('message');
      expect(pricing.message).to.contain('Intervalo de datas não disponível');
    });

    it('Quando o intervalo de datas é válido', async () => {
      const pricing = await service.pricing('2016-11-14', 103.5, '2016-12-16');

      expect(pricing).to.have.property('code');
      expect(pricing).to.have.property('result');
      expect(pricing.result).to.have.length(23);
    });
  });
});
