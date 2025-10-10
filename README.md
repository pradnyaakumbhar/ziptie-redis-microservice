# ziptie-redis-microservice

Small Express service that stores long URLs in Redis under randomly generated 12 character identifiers.

## Prerequisites

- Node.js 18+
- Redis instance (local or remote)

## Environment

You can provide connection details via a `.env` file or environment variables:

- `PORT` (default `3000`)
- `BASE_SHORT_URL` (optional, prepended to the generated short key in responses)
- `REDIS_URL` (full connection string, e.g. `redis://localhost:6379`)
- or `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`

Copy `.env.example` to `.env` to get started with sensible defaults.

## Install & Run

```bash
npm install
npm start
```

### Folder Layout

```
src/
  app.js                # Express app wiring
  index.js              # Service entry point
  config/
    env.js              # Environment configuration
    redisClient.js      # Redis client lifecycle
  controllers/          # Request handlers
  services/             # Business logic
  routes/               # Express routers
  utils/                # Helper utilities
  enums/                # Shared constants/enums
```

### Endpoints

- `POST /shorten` – body: `{ "ttl": 3600, "longUrl": "https://example.com", "userId": "user-123" }`
  - Stores the payload at a unique 12 character key with the provided TTL (seconds).
  - Responds with `{ "shortKey": "AbC123...", "expiresIn": 3600, "shortUrl": "BASE_SHORT_URL/AbC123..." }`.
- `GET /health` – returns the server and Redis status.

## Stopping

Ctrl+C triggers a graceful shutdown and closes the Redis connection.
