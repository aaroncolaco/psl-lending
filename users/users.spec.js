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

const otp = "123456";

const user = {
  "email": "aaron_colaco@persistent.co.in",
  "name": "John Doe"
};

const initUser = {
  "email": "aaron_colaco123@persistent.com",
  "ethAccount": "0x3a8e9a5fad5bd914ceb7055a727f0c92a7168bc9",
  "firebaseToken": "fwuRJg74v7g:APA91bE3GMYUhvRNKZHQCXs4s8NfbmX246e4GOeRS7sk1u2ZGB7NZ89FcffZLfQwo6tpk6_d-mVdemNealVxFc1lxm3bAtqfvt-b4Oe7uLKgdToz5tzIeOD_WSfnblNu4iRcNnMllxKZ",
  "name": "Jane Doe",
  "publicKey": "2387r9n8y249c7rny2347899mxcy934"
};

const updatedUser = {
  "email": "aaron_colaco765@persistent.com",
  "ethAccount": "0x3a8e9a5fad5bd914ceb7055a727f0c92a7168bc9fsdfdsfdsf",
  "firebaseToken": "fwuRJg74v7g:APA91bE3GMYUhvRNKZHQCXs4s8NfbmX246e4GOeRS7sk1u2ZGB7NZ89FcffZLfQwo6tpk6_d-mVdemNealVxFc1lxm3bAtqfvt-b4Oe7uLKgdToz5tzIeOD_WSfnblNu4iRcNnMllxKZ",
  "name": "John Doe",
  "publicKey": "2387r9n8y249cdsfsdfdsfsdf7rny2347899mxcy934"
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
        .send({otp})
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

  describe('POST /users/:id/account', () => {
    it('init user account without `ethAccount` & `firebaseToken` fails', (done) => {
      chai.request(completeURL + '/account')
        .post('/')
        .send({name: initUser.name, ethAccount: initUser.ethAccount, email:initUser.email})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.an('object');
          done();
        });
    });
    it('init user account without `ethAccount` fails', (done) => {
      chai.request(completeURL + '/account')
        .post('/')
        .send({name: initUser.name, firebaseToken: initUser.firebaseToken, email:initUser.email})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.an('object');
          done();
        });
    });
    it('init user account without `firebaseToken` fails', (done) => {
      chai.request(completeURL + '/account')
        .post('/')
        .send({name: initUser.name, ethAccount: initUser.ethAccount, email:initUser.email})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.an('object');
          done();
        });
    });
  });

  describe('POST /users/:id/account', () => {
    it('init verified user account', (done) => {
      chai.request(completeURL + '/account')
        .post('/')
        .send(initUser)
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res).to.be.an('object');
          done();
        });
    });
  });

  describe('POST /users/:id/init', () => {
    it('init created user multiple times fails', (done) => {
      chai.request(completeURL + '/init')
        .post('/')
        .send(initUser)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.an('object');
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
          expect(res.body.ethAccount).to.equal(initUser.ethAccount);
          expect(res.body.firebaseToken).to.equal(initUser.firebaseToken);
          expect(res.body.name).to.equal(initUser.name);
          expect(res.body.publicKey).to.equal(initUser.publicKey);

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
          expect(res.body.ethAccount).to.equal(initUser.ethAccount);
          expect(res.body.firebaseToken).to.equal(updatedUser.firebaseToken);
          expect(res.body.name).to.equal(updatedUser.name);
          expect(res.body.publicKey).to.equal(initUser.publicKey);

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
          expect(res.body.ethAccount).to.equal(initUser.ethAccount);
          expect(res.body.firebaseToken).to.equal(updatedUser.firebaseToken);
          expect(res.body.name).to.equal(updatedUser.name);
          expect(res.body.publicKey).to.equal(initUser.publicKey);

          done();
        });
    });
  });


});
