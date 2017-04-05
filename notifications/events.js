'use strict';

const request = require('request');
const Web3 = require('web3');

const config = require('../config');
const dealHelpers = require('../deals/helpers');
const lib = require('./lib');
const userHelpers = require('../users/helpers');

const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://10.51.229.126:8545'));


const ABI = [{"constant":false,"inputs":[{"name":"deal_id","type":"string"},{"name":"data","type":"bytes32"}],"name":"settleDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"deal_id","type":"string"},{"name":"data","type":"bytes32"}],"name":"acceptDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"counterparty","type":"address"},{"name":"data","type":"string"},{"name":"deal_id","type":"bytes32"}],"name":"createDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"deal_id","type":"string"},{"name":"data","type":"bytes32"}],"name":"acceptSettleDeal","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"data","type":"string"},{"indexed":true,"name":"deal_id","type":"bytes32"}],"name":"createDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"bytes32"}],"name":"acceptDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"bytes32"}],"name":"settleDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"bytes32"}],"name":"acceptSettleDealEvent","type":"event"}];

const blockchainContract = web3.eth.contract(ABI).at("0x04d1f33a1db14094ecf0985b1289d488c0c01c38");

const createDealEvent = blockchainContract.createDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  } else {
    console.error(error);
  }

  const ethereumId = result.args.deal_id;
  const txId = result.transactionHash;
  const lenderId = result.lender;
  const borrowerId = result.borrower;

  const status = 'created';

  const attributes = {
    ethereumId,
    lenderId,
    borrowerId,
    status,
    txId,
  };

  // create deal in DB
  request.post(config.getURL() + '/api/deals').form(attributes);
  // send notification
    // get borrower's firebase id from db to post to
  const where = {
    ethAccount: attributes.borrowerId
  };
  let to = null;

  userHelpers.findUser(where, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      to = user.firebaseToken;
      lib.notify(to, {data: result});
    };
  });
});

const acceptDealEvent = blockchainContract.acceptDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  } else {
    console.error(error);
  }

  const ethereumId = result.args.deal_id;
  const txId = result.transactionHash;

  const data = JSON.parse(result.args.data);
  const borrowerId = data.borrowerId;
  const id = data.id;
  const lenderId = data.lenderId;
  const status = 'accepted';

  const attributes = {
    status,
    txId
  };

  // update deal in DB
  request.post(config.getURL() + '/api/deals/' + id)
    .form(attributes);

  // send notification
    // get lender's firebase id from db to post to
  const where = {
    _id: lenderId
  };
  let to = null;

  userHelpers.findUser(where, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      to = user.firebaseToken;
      lib.notify(to, {data: result});
    };
  });

});

const settleDealEvent = blockchainContract.settleDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  }
});

const acceptSettleDealEvent = blockchainContract.acceptSettleDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  }
});


module.exports = {};
