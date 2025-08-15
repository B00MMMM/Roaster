const express = require('express');
const router = express.Router();
const { generateRoast } = require('../controllers/roastController');

router.post('/', generateRoast);

module.exports = router;
