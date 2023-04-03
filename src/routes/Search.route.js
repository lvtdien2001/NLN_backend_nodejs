const express = require('express');
const router = express.Router();

const SearchController = require('../controllers/Search.controller');

/** Search product */
router.get('/', SearchController.findAll);

module.exports = router
