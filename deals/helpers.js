'use strict';

const Deal = require('./model');


const createDeal = (attributes, callback) => {
  const newDeal = Deal(attributes);

  newDeal.save()
    .then((deal) => {
      return callback(null, newDeal);
    }, (err) => {
      return callback({"status": 400, "message": "Bad Data", "error": err}, null);
    });
};


const deleteDeal = (where, callback) => {
  Deal.findByIdAndRemove(where)
    .then((deal) => {
      if (!deal) {
        return callback({"status": 404, "message": "Not found"}, null);
      };
      return callback(null, deal);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};


const findDeal = (where, callback) => {
  Deal.findOne(where)
    .then((deal) => {
      if (!deal) {
        return callback({"status": 404, "message": "Not found"}, null);
      };
      return callback(null, deal);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};

const searchDeals = (limit, where, callback) => {
  Deal.find(where)
    .limit(limit < 100 ? limit:10)  // how many to return
    .sort({ status: 1 })
    .then((deals) => {
      if (!deals) {
        return callback({"status": 404, "message": "Not found"}, null);
      };
      return callback(null, deals);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};


const updateDeal = (where, attributes, callback) => {
  const id = where.id;

  Deal.findOne(where)
    .then((deal) => {
      if (!deal) {
        return callback({"status": 404, "message": "Not found"}, null);
      } else {
        // append lastest txId to array of txIds
        const txIds = deal.txIds;
        txIds.push(attributes.txIds);
        attributes.txIds = txIds;

        deal.update(attributes).then(() => {
         return callback(null, true);
        }, (err) => {
          return callback({"status": 400, "error": "Bad data"}, null);
        });
      };
    }, (err) => {
      console.log(err);
      return callback({"status": 500, "error": err}, null);
    });
};




module.exports = {
  createDeal,
  deleteDeal,
  findDeal,
  searchDeals,
  updateDeal
};
