'use strict';

const _ = require('lodash');
const helpers = require('./helpers');


const createDeal = (req, res) => {
  const attributes = {
    ethereumId: req.body.ethereumId,
    lenderId : req.body.lenderId,
    borrowerId : req.body.borrowerId,
    status : req.body.status,
    txIds : req.body.txId
  };

  helpers.createDeal(attributes, (err, deal) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(201).json(deal);
  });
};

const deleteDeal = (req, res) => {

  const where = {
    _id: req.params.id
  };

  helpers.deleteDeal(where, (err, deal) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(deal);
  });
};

const getAllDeals = (req, res) => {

  const query = req.query;
  const where = {};
  let limit = 10;

  // get all deals where user is either lender or borrower
  if (query.hasOwnProperty('ethAccount') && _.isString(query.ethAccount)) { // find all deals a person is part of
    let condition = {};
    let dealsUserIsPartOf = null;
    let ethAccount = null;

    ethAccount = query.ethAccount;

    condition = {
      lenderId: ethAccount
    };

    helpers.searchDeals(limit, condition, (err, dealsWhereUserIsLender) => {
      if (err) {
        console.error(err);
        return res.status(err.status || 500).json(err);
      }

      condition = {
        borrowerId: ethAccount
      };

      helpers.searchDeals(limit, condition, (err, dealsWhereUserIsBorrower) => {
        if (err) {
          console.error(err);
          return res.status(err.status || 500).json(err);
        }
        dealsUserIsPartOf = dealsWhereUserIsLender.concat(dealsWhereUserIsBorrower);

        return res.status(200).json(dealsUserIsPartOf);
      });
    });
  };

  // filter based on params
  if (query.hasOwnProperty('borrowerId') && _.isString(query.borrowerId)) {
    where.borrowerId = query.borrowerId;
  };
  if (query.hasOwnProperty('ethereumId') && _.isString(query.ethereumId)) {
    where.ethereumId = query.ethereumId;
  };
  if (query.hasOwnProperty('lenderId') && _.isString(query.lenderId)) {
    where.lenderId = query.lenderId;
  };
  if (query.hasOwnProperty('limit') && _.isInteger(query.limit)) {
    limit = query.limit;
  };

  helpers.searchDeals(limit, where, (err, deals) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(deals);
  });
};

const getDealById = (req, res) => {
  const where = {
    _id: req.params.id
  };

  helpers.findDeal(where, (err, deal) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(deal);
  });
};

const updateDeal = (req, res) => {
  const where = {
    _id: req.params.id
  };

  const attributes = {
    status : req.body.status,
    txIds: req.body.txId
  };

  helpers.updateDeal(where, attributes, (err, deal) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(202).json(deal);
  });
};


module.exports = {
  createDeal,
  deleteDeal,
  getAllDeals,
  getDealById,
  updateDeal
};
