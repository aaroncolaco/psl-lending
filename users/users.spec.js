'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const config = require('../config');

const hostURL = config.getURL();
const apiRootURL = '/api/users/';
var completeURL = hostURL + apiRootURL;
var usersUrl = completeURL;
var verificationURL = hostURL + apiRootURL;


const user = {
  "email": "aaron_colaco@persistent.co.in",
  "name": "John Doe"
};

const updatedUser = {
  "email": "aaron_colaco@persistent.com",
  "ethAccount": "fsdf79873453jkwhr89342",
  "firebaseToken": "ashfuidghf23784r698x3534895dsdgfsdg6556df4gdf1346yr72cy9weyrn23479r2348rwee",
  "name": "Jane Doe"
};


describe('User Tests', () => {
  describe('POST /users', () => {
    it('signup user', (done) => {
      chai.request(usersUrl)
        .post('')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.an('object');

          expect(res.body.email).to.equal(user.email);
          expect(res.body.name).to.equal(user.name);

          verificationURL = completeURL + 'verify/' + res.body._id;
          done();
        });
    });
  });

  describe('POST /users/verify/:id', () => {
    it('verify user', (done) => {
      chai.request(verificationURL)
        .post('')
        .send({"otp": "1234"})
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res).to.be.an('object');

          expect(res.body.email).to.equal(user.email);
          expect(res.body.name).to.equal(user.name);

          completeURL = completeURL + res.body._id;
          done();
        });
    });
  });

  describe('POST /users', () => {
    it('signup with existing email fails', (done) => {
      chai.request(usersUrl)
        .post('')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res).to.be.an('object');

          done();
        });
    });
  });

  describe('GET /users/?name=JohN D', () => {
    it('search users by name', (done) => {
      chai.request(usersUrl)
        .get('?name=JohN D')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].email).to.equal(user.email);
          expect(res.body[0].name).to.equal(user.name);

          done();
        });
    });
  });

  describe('GET /users/?email=aarO', () => {
    it('search users by email', (done) => {
      chai.request(usersUrl)
        .get('?email=aarO')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body[0].email).to.equal(user.email);
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

          expect(res.body.email).to.equal(user.email);
          expect(res.body.ethAccount).to.equal(updatedUser.ethAccount);
          expect(res.body.firebaseToken).to.equal(updatedUser.firebaseToken);
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

          expect(res.body.email).to.equal(user.email);
          expect(res.body.ethAccount).to.equal(updatedUser.ethAccount);
          expect(res.body.firebaseToken).to.equal(updatedUser.firebaseToken);
          expect(res.body.name).to.equal(updatedUser.name);

          done();
        });
    });
  });


});
