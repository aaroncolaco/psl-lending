'use strict';

const Deal = require('./model');


const createDeal = (attributes) => {
  const newDeal = Deal(attributes);

  return newDeal.save();
};


const deleteDeal = (id) => Deal.findByIdAndRemove(id);


const findDeal = (where) => Deal.findOne(where);


const searchDeals = (limit, where) => {
  limit = Math.min(Math.max(limit, 1), 100); // between [0,100] only
  return Deal.find(where)
    .limit(limit)
    .sort({ createdAt: 'desc' });
};


const updateDeal = (where, attributes) => {

  return Deal.findOne(where)
    .then((deal) => {
      if (!deal) {
        return Promise.resolve(false);
      }
      // append lastest txId to array of txIds
      const txIds = deal.txIds;
      txIds.push(attributes.txIds);
      attributes.txIds = txIds;

      return deal.update(attributes);
    });
};



module.exports = {
  createDeal,
  deleteDeal,
  findDeal,
  searchDeals,
  updateDeal
};
