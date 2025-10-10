const { Router } = require('express');
const urlRoutes = require('./urlRoutes');
const healthRoutes = require('./healthRoutes');

const router = Router();

router.use('/shorten', urlRoutes);
router.use('/health', healthRoutes);

module.exports = router;

