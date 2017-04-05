'use strict';

const fs = require('fs');
const request = require('request');
const Web3 = require('web3');

const config = require('../config');
const dealHelpers = require('../deals/helpers');
const lib = require('./lib');
const userHelpers = require('../users/helpers');

const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider(config.getGethUrl()));

const ABI = fs.readFileSync(__dirname + "/ABI.txt", "utf8").trim();
const address = fs.readFileSync(__dirname + "/contractAddress.txt", "utf8").trim();

const blockchainContract = web3.eth.contract(JSON.parse(ABI)).at(address.trim());

const createDealEvent = blockchainContract.createDealEvent((error, result) => {
  if (!error) {
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");

    const ethereumId = result.args.deal_id;
    const borrowerId = result.args.borrower.replace('0x', ''); // remove `0x` from the start of the string
    const lenderId = result.args.lender.replace('0x', ''); // remove `0x` from the start of the string
    const txId = result.transactionHash;

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

  } else {
    console.error(error);
  }
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
