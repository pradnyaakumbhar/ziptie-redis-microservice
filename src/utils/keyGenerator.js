const crypto = require('crypto');
const config = require('../config/env');

const ALPHANUMERIC =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateKey = () => {
  const length = config.shortKeyLength;
  const randomBytes = crypto.randomBytes(length);
  let key = '';

  for (let i = 0; i < length; i += 1) {
    const index = randomBytes[i] % ALPHANUMERIC.length;
    key += ALPHANUMERIC[index];
  }

  return key;
};

module.exports = {
  generateKey
};
