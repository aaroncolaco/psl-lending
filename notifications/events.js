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

    const ethereumId = result.args.deal_id.toString();
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
    console.log("\n\n", attributes, "\n\n");
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
        lib.notify(to, {data: JSON.stringify(result)});
      }
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

    const ethereumId = result.args.deal_id.toString();
    const txId = result.transactionHash;

    const data = JSON.parse(result.args.data);
    const borrowerId = data.to.replace('0x', '');
    const lenderId = data.from.replace('0x', '');

    const status = 'accepted';

    const attributes = {
      status,
      txId
    };

    // find and update deal in DB
    request(config.getURL() + '/api/deals/?ethereumId=' + ethereumId, (err, response, body) => {
      if (err) {
        console.error(err);
      } else {
        body = JSON.parse(body);
        const id = body[0]._id;
        request.post(config.getURL() + '/api/deals/' + id).form(attributes);

        // notify user
        const where = {
          ethAccount: lenderId
        };
        let to = null;

        userHelpers.findUser(where, (err, user) => {
          if (err) {
            console.error(err);
          } else {
            to = user.firebaseToken;
            lib.notify(to, {data: JSON.stringify(result)});
          }
        });
      }
    });
  } else {
    console.error(error);
  }

});

const settleDealEvent = blockchainContract.settleDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");

    const ethereumId = result.args.deal_id.toString();
    const txId = result.transactionHash;

    const data = JSON.parse(result.args.data);
    const borrowerId = data.to.replace('0x', '');
    const lenderId = data.from.replace('0x', '');

    const status = 'initiateSettlement';

    const attributes = {
      status,
      txId
    };

    // find and update deal in DB
    request(config.getURL() + '/api/deals/?ethereumId=' + ethereumId, (err, response, body) => {
      if (err) {
        console.error(err);
      } else {
        body = JSON.parse(body);
        const id = body[0]._id;
        request.post(config.getURL() + '/api/deals/' + id).form(attributes);

        // notify user
        const where = {
          ethAccount: lenderId
        };
        let to = null;

        userHelpers.findUser(where, (err, user) => {
          if (err) {
            console.error(err);
          } else {
            to = user.firebaseToken;
            lib.notify(to, {data: JSON.stringify(result)});
          }
        });
      }
    });
  } else {
    console.error(error);
  }
});

const acceptSettleDealEvent = blockchainContract.acceptSettleDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");

    const ethereumId = result.args.deal_id.toString();
    const txId = result.transactionHash;

    const data = JSON.parse(result.args.data);
    const borrowerId = data.to.replace('0x', '');
    const lenderId = data.from.replace('0x', '');

    const status = 'closed';

    const attributes = {
      status,
      txId
    };

    // find and update deal in DB
    request(config.getURL() + '/api/deals/?ethereumId=' + ethereumId, (err, response, body) => {
      if (err) {
        console.error(err);
      } else {
        body = JSON.parse(body);
        const id = body[0]._id;
        request.post(config.getURL() + '/api/deals/' + id).form(attributes);

        // notify user
        const where = {
          ethAccount: lenderId
        };
        let to = null;

        userHelpers.findUser(where, (err, user) => {
          if (err) {
            console.error(err);
          } else {
            to = user.firebaseToken;
            lib.notify(to, {data: JSON.stringify(result)});
          }
        });
      }
    });
  } else {
    console.error(error);
  }
});


module.exports = {};
