'use strict';

const helpers = require('./helpers');


const createDeal = (req, res) => {
  const attributes = {
    lenderId : req.body.lenderId,
    borrowerId : req.body.borrowerId,
    accepted : req.body.accepted,
    txIds : req.body.txIds,
    lenderSig : req.body.lenderSig,
    borrowerSig : req.body.borrowerSig,
    textHash : req.body.textHash
  };

  helpers.createDeal(attributes, (err, deal) => {
    if (err) {
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
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(deal);
  });
};

const getAllDeals = (req, res) => {
  return res.json({"message": "Return all deals"});
};

const getDealById = (req, res) => {
  const where = {
    _id: req.params.id
  };

  helpers.findDeal(where, (err, deal) => {
    if (err) {
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
    accepted : req.body.accepted,
  };

  helpers.updateDeal(where, attributes, (err, deal) => {
    if (err) {
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
