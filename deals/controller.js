'use strict';

const _ = require('lodash');
const helpers = require('./helpers');


const createDeal = (req, res) => {
  helpers.createDeal(reqToDealAttributes(req))
    .then(deal => {
      if (!deal) {
        return errorResponse(res, "Invalid data", Error("Invalid data"), 400);
      }
      res.status(201).json(deal);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not create resource", err);
    });
};

const deleteDeal = (req, res) => {
  helpers.deleteDeal(req.params.id)
    .then(deal => {
      if (!deal) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      res.status(200).json(deal);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete resource", err);
    });
};

const getAllDeals = (req, res) => {

  const query = req.query;
  const where = {};
  let limit = 10;

  if (query.hasOwnProperty('limit') && _.isInteger(parseInt(query.limit))) {
    limit = parseInt(query.limit);
  }

  // get all deals where user is either lender or borrower
  if (query.hasOwnProperty('ethAccount') && _.isString(query.ethAccount)) {
    let condition = {};
    let dealsUserIsPartOf = [];
    let ethAccount = null;

    ethAccount = query.ethAccount;

    condition = {
      lenderId: ethAccount
    };

    helpers.searchDeals(limit, condition)
      .then(dealsWhereUserIsLender => {
        if (!!dealsWhereUserIsLender) {
          dealsUserIsPartOf = dealsWhereUserIsLender;
        }
        condition = {
          borrowerId: ethAccount
        };
        return helpers.searchDeals(limit, condition);
      })
      .then(dealsWhereUserIsBorrower => {
        if (!!dealsWhereUserIsBorrower) {
          dealsUserIsPartOf = dealsUserIsPartOf.concat(dealsWhereUserIsBorrower);
        }
        return res.json(dealsUserIsPartOf);
      })
      .catch(err => {
        console.error(err);
        return errorResponse(res, "Something went wrong", err);
      });
  } else {
    // filter based on params
    if (query.hasOwnProperty('borrowerId') && _.isString(query.borrowerId)) {
      where.borrowerId = query.borrowerId;
    }
    if (query.hasOwnProperty('ethereumId') && _.isString(query.ethereumId)) {
      where.ethereumId = query.ethereumId;
    }
    if (query.hasOwnProperty('lenderId') && _.isString(query.lenderId)) {
      where.lenderId = query.lenderId;
    }

    helpers.searchDeals(limit, where)
      .then(deals => {
        if (!deals) {
          return errorResponse(res, "Not found", Error("Not found"), 404);
        }
        return res.json(deals);
      })
      .catch(err => {
        console.error(err);
        return errorResponse(res, "Something went wrong", err);
      });
  }
};

const getDealById = (req, res) => {
  const where = {
    _id: req.params.id
  };

  helpers.findDeal(where)
    .then(deal => {
      if (!deal) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      return res.json(deal);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Something went wrong", err);
    });
};

const updateDeal = (req, res) => {
  const where = {
    _id: req.params.id
  };

  const attributes = {
    status: req.body.status,
    txIds: req.body.txId
  };

  helpers.updateDeal(where, attributes)
    .then(success => {
      if (!success) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      return res.status(202).json({status: 200, message: "Updated"});
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Something went wrong", err);
    });
};


const reqToDealAttributes = (req) => ({
  ethereumId: req.body.ethereumId,
  lenderId: req.body.lenderId,
  borrowerId: req.body.borrowerId,
  status: req.body.status,
  txIds: req.body.txId
});

const errorResponse = (res, message, error, status = 500) =>
  res.status(status).json({ "status": status, "message": message, "error": error });


module.exports = {
  createDeal,
  deleteDeal,
  getAllDeals,
  getDealById,
  updateDeal
};
