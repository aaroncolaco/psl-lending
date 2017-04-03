'use strict';

const request = require('request');
const Web3 = require('web3');

const config = require('../config');
const dealHelpers = require('../deals/helpers');
const lib = require('./lib');
const userHelpers = require('../users/helpers');

const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://10.51.229.126:8545'));


const ABI = [{"constant":false,"inputs":[{"name":"counterparty","type":"address"},{"name":"deal_id","type":"string"},{"name":"data","type":"string"}],"name":"acceptSettleDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"counterparty","type":"address"},{"name":"data","type":"string"},{"name":"deal_id","type":"string"}],"name":"createDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"counterparty","type":"address"},{"name":"deal_id","type":"string"},{"name":"data","type":"string"}],"name":"acceptDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"counterparty","type":"address"},{"name":"deal_id","type":"string"},{"name":"data","type":"string"}],"name":"settleDeal","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"data","type":"string"},{"indexed":false,"name":"deal_id","type":"string"}],"name":"createDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"string"}],"name":"acceptDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"string"}],"name":"settleDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"string"}],"name":"acceptSettleDealEvent","type":"event"}];

const blockchainContract = web3.eth.contract(ABI).at("0x851a0785e9176714f956b2f569ad7d8591706667");

const createDealEvent = blockchainContract.createDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  } else {
    console.log(error);
    return;
  }

  const ethereumId = result.args.deal_id;
  const txId = result.transactionHash;

  const data = JSON.parse(result.args.data);
  const lenderId = data.lenderId;
  const borrowerId = data.borrowerId;
  const status = 'created';
  const textHash = data.hash;

  const attributes = {
    ethereumId,
    lenderId,
    borrowerId,
    status,
    txId,
    textHash
  };

  // create deal in DB
  request.post(config.getURL() + '/api/deals').form(attributes);
  // send notification
    // get borrower's firebase id from db to post to
  const where = {
    _id: attributes.borrowerId
  };
  let to = null;

  userHelpers.findUser(where, (err, user) => {
    if (err) {
      console.log(err);
      return;
    }
    to = user.firebaseToken;
    lib.notify(to, {data: result});
    return;
  });
});

const acceptDealEvent = blockchainContract.acceptDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  } else {
    console.log(error);
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
      console.log(err);
      return;
    }
    to = user.firebaseToken;
    lib.notify(to, {data: result});
    return;
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
