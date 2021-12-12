const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

const model = require('../../model');
const mockCDI = require('../mocks/mockCDI').map((obj) => ({ ...obj, dtDate: new Date(obj.dtDate) }));

const server = require('../../api/app');

describe('Testando endpoint principal', () => {
  beforeAll(async () => {
    sinon.stub(model, 'getCDIHistory').resolves(mockCDI);
  });

  afterAll(() => {
    model.getCDIHistory.restore();
  });

  describe('Em caso de sucesso', () => {
    let response = {};
    beforeAll(async () => {
      response = await chai.request(server)
        .get('/pricing?investmentDate=2016-11-14&cdbRate=103.5&currentDate=2016-12-26');
    });

    it('recebe status code 200', () => {
      expect(response).to.have.status(200);
    });

    it('recebe o objeto correto como resposta', () => {
      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(29);

      response.body.data.forEach(((obj) => {
        expect(obj).to.be.an('object');
        expect(obj).to.have.property('date');
        expect(obj).to.have.property('unitPrice');
      }));
    });
  });

  describe('Em caso de request com parametro ausente', () => {
    let response = {};
    beforeAll(async () => {
      response = await chai.request(server)
        .get('/pricing?investmentDate=2016-11-14&currentDate=2016-12-26');
    });

    it('recebe status code 400', () => {
      expect(response).to.have.status(400);
    });

    it('recebe o objeto correto como resposta', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.contain('investmentDate, cdbRate e currentDate são parametros mandatórios');
    });
  });

  describe('Em caso de request com datas em formato inválido', () => {
    let response = {};
    beforeAll(async () => {
      response = await chai.request(server)
        .get('/pricing?investmentDate=2016/11/14&cdbRate=103.5&currentDate=2016/12/26');
    });

    it('recebe status code 400', () => {
      expect(response).to.have.status(400);
    });

    it('recebe o objeto correto como resposta', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.contain('formato das datas inválido');
    });
  });

  describe('Em caso de request com intervalo de datas inválido', () => {
    let response = {};
    beforeAll(async () => {
      response = await chai.request(server)
        .get('/pricing?investmentDate=2018-11-14&cdbRate=103.5&currentDate=2016-12-26');
    });

    it('recebe status code 400', () => {
      expect(response).to.have.status(400);
    });

    it('recebe o objeto correto como resposta', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.contain('data de investimento deve ser anterior á atual');
    });
  });

  describe('Em caso de request com taxa inválida', () => {
    let response = {};
    beforeAll(async () => {
      response = await chai.request(server)
        .get('/pricing?investmentDate=2016-11-14&cdbRate=103e5&currentDate=2016-12-26');
    });

    it('recebe status code 400', () => {
      expect(response).to.have.status(400);
    });

    it('recebe o objeto correto como resposta', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.contain('formato da taxa inválido');
    });
  });
});
