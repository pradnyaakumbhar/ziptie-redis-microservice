const express = require('express');
const routes = require('./routes');
const config = require('./config/env');

const app = express();

console.log('[cors] redis allowing all origins for testing');

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('[cors] redis request origin:', origin || '<none>');

  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use('/', routes);

// Basic error handler to avoid leaking errors
app.use((err, req, res, next) => {
  console.error('[app:error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
