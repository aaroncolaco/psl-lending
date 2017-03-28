'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const config = require('../config');

const hostURL = config.getURL();
const apiRootURL = '/api/deals/';
var completeURL = hostURL + apiRootURL;


const deal = {
  "lenderId": "lenderId",
  "borrowerId": "borrowerId",
  "accepted": false,
  "lenderSig": "lenderSig",
  "borrowerSig": "borrowerSig",
  "textHash": "textHash"
};

const updatedDeal = {
  "accepted": true
};


describe('Deal Tests', () => {
  describe('POST /deals', () => {
    it('created new deal', (done) => {
      chai.request(completeURL)
        .post('/')
        .send(deal)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.accepted).to.equal(deal.accepted);
          expect(res.body.lenderSig).to.equal(deal.lenderSig);
          expect(res.body.borrowerSig).to.equal(deal.borrowerSig);
          expect(res.body.textHash).to.equal(deal.textHash);

          completeURL = completeURL + res.body._id;
          done();
        });
    });
  });

  describe('GET /deals/:id', () => {
    it('read created deal', (done) => {
      chai.request(completeURL)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.accepted).to.equal(deal.accepted);
          expect(res.body.lenderSig).to.equal(deal.lenderSig);
          expect(res.body.borrowerSig).to.equal(deal.borrowerSig);
          expect(res.body.textHash).to.equal(deal.textHash);

          done();
        });
    });
  });

  describe('POST /deals/:id', () => {
    it('update created deal', (done) => {
      chai.request(completeURL)
        .post('/')
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
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.accepted).to.equal(updatedDeal.accepted);
          expect(res.body.lenderSig).to.equal(deal.lenderSig);
          expect(res.body.borrowerSig).to.equal(deal.borrowerSig);
          expect(res.body.textHash).to.equal(deal.textHash);

          done();
        });
    });
  });

  describe('DELETE /deals/:id', () => {
    it('delete created deal', (done) => {
      chai.request(completeURL)
        .delete('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.lenderId).to.equal(deal.lenderId);
          expect(res.body.borrowerId).to.equal(deal.borrowerId);
          expect(res.body.accepted).to.equal(updatedDeal.accepted);
          expect(res.body.lenderSig).to.equal(deal.lenderSig);
          expect(res.body.borrowerSig).to.equal(deal.borrowerSig);
          expect(res.body.textHash).to.equal(deal.textHash);

          done();
        });
    });
  });


});
