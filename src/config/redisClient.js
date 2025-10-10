const { createClient } = require('redis');
const config = require('./env');

let client;

const getRedisClient = async () => {
  if (!client) {
    client = createClient(config.redis);

    client.on('error', (error) => {
      console.error('[redis:error]', error);
    });

    await client.connect();
    console.log('[redis] connected');
  }

  return client;
};

const closeRedisClient = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

module.exports = {
  getRedisClient,
  closeRedisClient
};
