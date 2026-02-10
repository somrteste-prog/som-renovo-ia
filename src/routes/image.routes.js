const express = require('express');
const router = express.Router();

const { createImage } = require('../controllers/image.controller');

router.post('/image', createImage);

module.exports = router;