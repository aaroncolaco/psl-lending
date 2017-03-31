'use strict';


const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://10.51.229.126:8545'));


const ABI = [{"constant":false,"inputs":[{"name":"deal_id","type":"string"},{"name":"data","type":"string"}],"name":"acceptSettleDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"data","type":"string"},{"name":"deal_id","type":"string"}],"name":"createDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"deal_id","type":"string"},{"name":"data","type":"string"}],"name":"acceptDeal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"deal_id","type":"string"},{"name":"data","type":"string"}],"name":"settleDeal","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"data","type":"string"},{"indexed":false,"name":"deal_id","type":"string"}],"name":"createDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"string"}],"name":"acceptDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"string"}],"name":"settleDealEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deal_id","type":"string"},{"indexed":false,"name":"data","type":"string"}],"name":"acceptSettleDealEvent","type":"event"}];

const blockchainContract = web3.eth.contract(ABI).at("0x8a48289e41651d080e54e0d91fc422c12b13aeb7");

console.log(blockchainContract);

const createDealEvent = blockchainContract.createDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  } else {
    console.log(error);
  }
});

const acceptDealEvent = blockchainContract.acceptDealEvent((error, result) => {
  if (!error) {
    console.log(result + "\n");
    console.log(JSON.stringify(result) + "\n");
    console.log(JSON.stringify(result.args) + "\n");
  } else {
    console.log(error);
  }
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
