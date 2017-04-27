'use strict';

const _ = require('lodash');
const fs = require('fs');
const Web3 = require('web3');

const config = require('../config');
const lib = require('./lib');
const userHelpers = require('../users/helpers');

const ABI = fs.readFileSync(__dirname + "/ABI.txt", "utf8").trim();
const address = fs.readFileSync(__dirname + "/contractAddress.txt", "utf8").trim();

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.getGethUrl()));
const contractInstance = web3.eth.contract(JSON.parse(ABI)).at(address);

// const createContractEvent = contractInstance.acceptContractEvent();
// createContractEvent.watch((err, result) => {
//   if (err) {
//     return logError("createContractEvent", err);
//   }
//   console.log(JSON.stringify(result) + "\n");
//   console.log(JSON.stringify(result.args) + "\n");

//   const { message, userEthAccount } = eventResultToData(result);

//   console.log(`Notification: ${message} \n`);

//   notifyUser("createContractEvent", message, userEthAccount);
// });

const allEvents = contractInstance.allEvents();
allEvents.watch((err, result) => {
  if (err) {
    return logError("createContractEvent", err);
  }
  console.log("Result: ", JSON.stringify(result) + "\n");
  console.log("Result Args: ", JSON.stringify(result.args) + "\n");

  const { eventName, message, userEthAccount } = eventResultToData(result);

  console.log(`Notification: ${JSON.stringify(message)} \n`);

  notifyUser(eventName, message, userEthAccount);
});


// const acceptContractEvent = contractInstance.acceptContractEvent((err, result) => {
//   if (err) {
//     return logError("createContractEvent", err);
//   }
//   console.log(JSON.stringify(result) + "\n");
//   console.log(JSON.stringify(result.args) + "\n");

//   const { message, userEthAccount } = eventResultToData(result);

//   console.log(`Notification: ${message} \n`);

//   notifyUser("acceptContractEvent", message, userEthAccount);
// });


// const settleContractEvent = contractInstance.settleContractEvent((err, result) => {
//   if (err) {
//     return logError("createContractEvent", err);
//   }
//   console.log(JSON.stringify(result) + "\n");
//   console.log(JSON.stringify(result.args) + "\n");

//   const { message, userEthAccount } = eventResultToData(result);

//   console.log(`Notification: ${message} \n`);
//   console.log(`Eth Account: ${userEthAccount} \n`);
//   notifyUser("settleContractEvent", message, userEthAccount);
// });


// const acceptSettleContractEvent = contractInstance.acceptSettleContractEvent((err, result) => {
//   if (err) {
//     return logError("createContractEvent", err);
//   }
//   console.log(JSON.stringify(result) + "\n");
//   console.log(JSON.stringify(result.args) + "\n");

//   const { message, userEthAccount } = eventResultToData(result);

//   console.log(`Notification: ${message} \n`);

//   notifyUser("acceptContractEvent", message, userEthAccount);
// });


// helper functions
const eventResultToData = (eventResult) => {

  const eventName = eventResult.event;

  const data = JSON.parse(eventResult.args.data);

  const userEthAccount = data.to; // eth account of person to notify

  const message = {
    data: _.omit(data, ['to'])
  };

  return {
    eventName,
    message,
    userEthAccount
  };
};

const notifyUser = (eventName, message, userEthAccount) => {
  return userHelpers.findUser({ ethAccount: userEthAccount })
    .then(user => {
      if (!user) {
        return logError(eventName, Error("Cannot send notification to unknown Ethereum user account: " + userEthAccount));
      }
      lib.notify(user.ethAccount, message)
        .then(response => console.log("Successfully sent message:", response));
    })
    .catch(err => logError(eventName, err));
};

const logError = (eventName, error) =>
  console.error("Error in: " + eventName + "\n" + error + "\n\n");

module.exports = {};

// test stuff
/*
web3.eth.getBlock(48, function (error, result) {
  if (!error)
    console.log(`Get a block: ${JSON.stringify(result)}`);
  else
    console.error(error);
});

const listening = web3.net.listening;
console.log(`Listening for connections: ${listening}`);

const events = contractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
events.watch(function(error, result){
  console.log(error, result);
});
*/
