const { expect } = require('chai');
const sinon = require('sinon');

const service = require('../../service');
const controller = require('../../controller');

const serviceOutput = require('../mocks/mockServiceOutput');

describe('Teste da camada de controller', () => {
  it('Em caso de sucesso', async () => {
    sinon.stub(service, 'pricing').resolves({ code: 200, result: serviceOutput });
    const res = {};
    const req = {
      inputs: {
        investmentDate: '2016-11-14',
        cdbRate: 103.5,
        currentDate: '2016-12-26',
      },
    };
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    await controller.pricing(req, res);

    expect(res.status.calledWith(200)).to.be.equal(true);
    expect(res.json.calledWith({ data: serviceOutput })).to.be.equal(true);

    service.pricing.restore();
  });

  it('Em caso de falha', async () => {
    sinon.stub(service, 'pricing').resolves({ code: 400, message: 'Intervalo de datas não disponível' });
    const res = {};
    const req = {
      inputs: {
        investmentDate: '2016-11-14',
        cdbRate: 103.5,
        currentDate: '2022-12-26',
      },
    };
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    await controller.pricing(req, res);

    expect(res.status.calledWith(400)).to.be.equal(true);
    expect(res.json.calledWith({ message: 'Intervalo de datas não disponível' })).to.be.equal(true);

    service.pricing.restore();
  });
});
