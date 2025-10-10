const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/', routes);

// Basic error handler to avoid leaking errors
app.use((err, req, res, next) => {
  console.error('[app:error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;

