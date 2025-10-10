const httpStatus = require('../enums/httpStatus');
const healthService = require('../services/healthService');

const getHealth = async (req, res) => {
  try {
    const status = await healthService.getHealthStatus();
    return res.status(httpStatus.OK).json(status);
  } catch (error) {
    console.error('[healthController:getHealth]', error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', message: 'Service unavailable' });
  }
};

module.exports = {
  getHealth
};
