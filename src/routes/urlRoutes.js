const { Router } = require('express');
const urlController = require('../controllers/urlController');

const router = Router();

router.post('/', urlController.createShortUrl);

module.exports = router;

