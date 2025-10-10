const { getRedisClient } = require('../config/redisClient');

async function getHealthStatus() {
  const client = await getRedisClient();
  const redisStatus = await client.ping();

  return {
    status: 'ok',
    redis: redisStatus
  };
}

module.exports = {
  getHealthStatus
};

