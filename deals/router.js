'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.getAllDeals);
router.get('/:id', controller.getDealById);
router.post('/', controller.createDeal);
router.post('/:id', controller.updateDeal);
router.delete('/:id', controller.deleteDeal);

module.exports = router;
