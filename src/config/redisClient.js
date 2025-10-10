const { createClient } = require('redis');
const config = require('./env');

let client;

async function getRedisClient() {
  if (!client) {
    client = createClient(config.redis);

    client.on('error', (error) => {
      console.error('[redis:error]', error);
    });

    await client.connect();
  }

  return client;
}

async function closeRedisClient() {
  if (client) {
    await client.quit();
    client = null;
  }
}

module.exports = {
  getRedisClient,
  closeRedisClient
};

