const express = require('express');
const airQualityController = require('../controllers/airQualityController');

const router = express.Router();

router.use('/', airQualityController);

module.exports = router;
