const config = require('../config/env');
const { getRedisClient } = require('../config/redisClient');
const { generateKey } = require('../utils/keyGenerator');

const MAX_KEY_GENERATION_ATTEMPTS = 5;

const generateUniqueKey = async (client) => {
  for (let attempt = 0; attempt < MAX_KEY_GENERATION_ATTEMPTS; attempt += 1) {
    const candidate = generateKey();
    const exists = await client.exists(candidate);

    if (!exists) {
      return candidate;
    }
  }

  throw new Error('Unable to generate unique short key');
};

const buildShortUrl = (shortKey) => {
  if (!config.baseShortUrl) {
    return undefined;
  }

  const normalizedBase = config.baseShortUrl.endsWith('/')
    ? config.baseShortUrl.slice(0, -1)
    : config.baseShortUrl;

  return `${normalizedBase}/${shortKey}`;
};

const createShortUrl = async ({ ttl, longUrl, userId }) => {
  const client = await getRedisClient();
  const shortKey = await generateUniqueKey(client);

  const payload = JSON.stringify({
    longUrl,
    userId,
    createdAt: new Date().toISOString()
  });

  await client.set(shortKey, payload, { EX: ttl });

  return {
    shortKey,
    expiresIn: ttl,
    shortUrl: buildShortUrl(shortKey)
  };
};

module.exports = {
  createShortUrl
};
