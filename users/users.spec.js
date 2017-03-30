'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const config = require('../config');

const hostURL = config.getURL();
const apiRootURL = '/api/users/';
var completeURL = hostURL + apiRootURL;


const user = {
  "email": "johndoe@google.com",
  "name": "John Doe"
};

const updatedUser = {
  "email": "janedoe@google.com",
  "ethAccount": "fsdf79873453jkwhr89342",
  "name": "Jane Doe"
};


describe('User Tests', () => {
  describe('POST /users', () => {
    it('created new user', (done) => {
      chai.request(completeURL)
        .post('')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.an('object');

          expect(res.body.email).to.equal(user.email);
          expect(res.body.ethAccount).to.equal(undefined);
          expect(res.body.name).to.equal(user.name);

          completeURL = completeURL + res.body._id;
          done();
        });
    });
  });

  describe('GET /users/?name=JohN D', () => {
    it('search users by name', (done) => {
      chai.request(hostURL + apiRootURL)
        .get('?name=JohN D')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].email).to.equal(user.email);
          expect(res.body[0].ethAccount).to.equal(undefined);
          expect(res.body[0].name).to.equal(user.name);

          done();
        });
    });
  });

  describe('GET /users/?email=joHn', () => {
    it('search users by email', (done) => {
      chai.request(hostURL + apiRootURL)
        .get('?email=joHn')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].email).to.equal(user.email);
          expect(res.body[0].ethAccount).to.equal(undefined);
          expect(res.body[0].name).to.equal(user.name);

          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('read created user', (done) => {
      chai.request(completeURL)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.email).to.equal(user.email);
          expect(res.body.ethAccount).to.equal(undefined);
          expect(res.body.name).to.equal(user.name);

          done();
        });
    });
  });

  describe('POST /users/:id', () => {
    it('update created user', (done) => {
      chai.request(completeURL)
        .post('/')
        .send(updatedUser)
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res).to.be.an('object');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('read updated user', (done) => {
      chai.request(completeURL)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.email).to.equal(updatedUser.email);
          expect(res.body.ethAccount).to.equal(updatedUser.ethAccount);
          expect(res.body.name).to.equal(updatedUser.name);

          done();
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('delete created user', (done) => {
      chai.request(completeURL)
        .delete('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.email).to.equal(updatedUser.email);
          expect(res.body.ethAccount).to.equal(updatedUser.ethAccount);
          expect(res.body.name).to.equal(updatedUser.name);

          done();
        });
    });
  });


});
