const { getRedisClient } = require('../config/redisClient');

const getHealthStatus = async () => {
  const client = await getRedisClient();
  const redisStatus = await client.ping();

  return {
    status: 'ok',
    redis: redisStatus
  };
};

module.exports = {
  getHealthStatus
};
