const app = require('./app');
const config = require('./config/env');
const { getRedisClient, closeRedisClient } = require('./config/redisClient');

async function start() {
  try {
    await getRedisClient();

    const server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });

    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      server.close();
      await closeRedisClient();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start service', error);
    process.exit(1);
  }
}

start();

