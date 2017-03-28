'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.post('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
