'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const bin = require('../bin/www');
const config = require('../config');

const hostURL = config.getURL();
const apiRootURL = '/api/deals/';
var completeURL = hostURL + apiRootURL;


const deal = {
  "ethereumId": "ethereumId",
  "lenderId": "58dc8871489d286ee66487aa",
  "borrowerId": "58dc8871489d286ee66487ab",
  "status": "created",
  "txId": "txId"
};

const updatedDeal = {
  "status": "accepted",
  "txId": "34234234fdsf"
};


describe('Deal Tests', () => {
  describe('POST /deals', () => {
    it('created new deal', (done) => {
      chai.request(completeURL)
        .post('')
        .send(deal)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.an('object');

          expect(res.body.ethereumId).to.equal(deal.ethereumId);
          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.status).to.equal(deal.status);
          expect(res.body.txIds[0]).to.equal(deal.txId);

          completeURL = completeURL + res.body._id;
          done();
        });
    });
  });

  describe('GET /deals/:id', () => {
    it('read created deal', (done) => {
      chai.request(completeURL)
        .get('')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.ethereumId).to.equal(deal.ethereumId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.status).to.equal(deal.status);
          expect(res.body.txIds[0]).to.equal(deal.txId);

          done();
        });
    });
  });

  describe('GET /deals/?lenderId=58dc8871489d286ee66487aa', () => {
    it('search deals by lenderId', (done) => {
      chai.request(hostURL + apiRootURL)
        .get('?lenderId=58dc8871489d286ee66487aa')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].lenderId).to.equal(deal.lenderId);
          expect(res.body[0].ethereumId).to.equal(deal.ethereumId);
          expect(res.body[0].borrowerId).to.equal(deal.borrowerId);
          expect(res.body[0].status).to.equal(deal.status);
          expect(res.body[0].txIds[0]).to.equal(deal.txId);

          done();
        });
    });
  });

  describe('GET /deals/?borrowerId=58dc8871489d286ee66487ab', () => {
    it('search deals by borrowerId', (done) => {
      chai.request(hostURL + apiRootURL)
        .get('?borrowerId=58dc8871489d286ee66487ab')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].lenderId).to.equal(deal.lenderId);
          expect(res.body[0].ethereumId).to.equal(deal.ethereumId);
          expect(res.body[0].borrowerId).to.equal(deal.borrowerId);
          expect(res.body[0].status).to.equal(deal.status);
          expect(res.body[0].txIds[0]).to.equal(deal.txId);

          done();
        });
    });
  });

  describe('POST /deals/:id', () => {
    it('update created deal', (done) => {
      chai.request(completeURL)
        .post('')
        .send(updatedDeal)
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res).to.be.an('object');
          done();
        });
    });
  });

  describe('GET /deals/:id', () => {
    it('read updated deal', (done) => {
      chai.request(completeURL)
        .get('')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.ethereumId).to.equal(deal.ethereumId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.status).to.equal(updatedDeal.status);
          expect(res.body.txIds[0]).to.deep.equal(deal.txId);
          expect(res.body.txIds[1]).to.deep.equal(updatedDeal.txId);

          done();
        });
    });
  });

  describe('GET /deals/?lenderId=58dc8871489d286ee66487aa', () => {
    it('search deals by lenderId', (done) => {
      chai.request(hostURL + apiRootURL)
        .get('?lenderId=58dc8871489d286ee66487aa')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].lenderId).to.equal(deal.lenderId);
          expect(res.body[0].ethereumId).to.equal(deal.ethereumId);
          expect(res.body[0].borrowerId).to.equal(deal.borrowerId);
          expect(res.body[0].status).to.equal(updatedDeal.status);
          expect(res.body[0].txIds[0]).to.equal(deal.txId);
          expect(res.body[0].txIds[1]).to.deep.equal(updatedDeal.txId);

          done();
        });
    });
  });

  describe('GET /deals/?borrowerId=58dc8871489d286ee66487ab', () => {
    it('search deals by borrowerId', (done) => {
      chai.request(hostURL + apiRootURL)
        .get('?borrowerId=58dc8871489d286ee66487ab')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].lenderId).to.equal(deal.lenderId);
          expect(res.body[0].ethereumId).to.equal(deal.ethereumId);
          expect(res.body[0].borrowerId).to.equal(deal.borrowerId);
          expect(res.body[0].status).to.equal(updatedDeal.status);
          expect(res.body[0].txIds[0]).to.equal(deal.txId);
          expect(res.body[0].txIds[1]).to.deep.equal(updatedDeal.txId);

          done();
        });
    });
  });

  describe('DELETE /deals/:id', () => {
    it('delete created deal', (done) => {
      chai.request(completeURL)
        .delete('')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.ethereumId).to.equal(deal.ethereumId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.status).to.equal(updatedDeal.status);
          expect(res.body.txIds[0]).to.deep.equal(deal.txId);
          expect(res.body.txIds[1]).to.deep.equal(updatedDeal.txId);

          done();
        });
    });
  });


});
