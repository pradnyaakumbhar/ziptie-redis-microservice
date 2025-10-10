const dotenv = require('dotenv');

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const config = {
  port: toNumber(process.env.PORT, 3000),
  baseShortUrl: process.env.BASE_SHORT_URL,
  shortKeyLength: toNumber(process.env.SHORT_KEY_LENGTH, 12),
  redis: {}
};

if (!config.shortKeyLength || config.shortKeyLength < 1) {
  config.shortKeyLength = 12;
}

if (process.env.REDIS_URL) {
  config.redis.url = process.env.REDIS_URL;
} else {
  config.redis.socket = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: toNumber(process.env.REDIS_PORT, 6379)
  };

  if (process.env.REDIS_USERNAME) {
    config.redis.username = process.env.REDIS_USERNAME;
  }

  if (process.env.REDIS_PASSWORD) {
    config.redis.password = process.env.REDIS_PASSWORD;
  }
}

module.exports = config;
