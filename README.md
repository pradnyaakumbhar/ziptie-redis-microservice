# ziptie-redis-microservice

Express microservice responsible for the core URL shortening workflow. It stores JSON payloads inside Redis (or Upstash via REST) under 12-character identifiers and exposes fast endpoints that other ZipTie services call.

## Prerequisites

- Node.js 18+
- Redis instance (self-hosted, Docker, or Upstash REST)

## Environment

Copy `.env.example` to `.env` and fill in the variables that match your setup:

```
PORT=3000
BASE_SHORT_URL=https://links.ziptie.dev

# Redis TCP
REDIS_URL=redis://localhost:6379
# or granular:
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=

# Optional Upstash REST fallback
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

When the Upstash variables are present the service automatically switches to the REST client; otherwise it connects via `redis@5`.

## Install & Run

```bash
npm install
npm run dev    # nodemon (if configured) or use npm start
npm start      # production mode
```

The server listens on `PORT` (defaults to `3000`).

## Endpoints

| Method & Path | Description |
| ------------- | ----------- |
| `POST /shorten` | Body: `{ ttl, longUrl, userId }`. Generates a 12-char key, stores the payload as JSON in Redis with TTL (seconds), and responds with `{ shortKey, expiresIn, shortUrl }`. |
| `POST /resolve` | Body: `{ shortKey }`. Looks up the key, parses the stored JSON, and returns `{ longUrl, userId, createdAt, shortUrl }`. Responds with `404` if missing or expired. |
| `GET /health` | Returns `{ server: 'ok', redis: 'connected' }` plus timestamps. |

## Project Layout

```
src/
  index.js              # Service entry
  app.js                # Express wiring & middleware
  config/               # env + Redis client factories
  controllers/          # HTTP handlers
  services/             # Shorten/resolve logic
  routes/               # Express routers per resource
  utils/                # helpers (key generator, response builders)
  enums/                # shared constants
```

## Development Notes

- `src/config/redisClient.js` transparently swaps between Redis TCP and Upstash REST.
- Payloads are stored as JSON strings; the resolver gracefully handles strings or objects so Upstash responses work as expected.
- Use `npm test` once you add coverage; currently there are no automated tests.

## Shutdown

Use `Ctrl+C` to stop the process. The `closeRedisClient` helper drains the Redis connection (or no-ops if using Upstash REST) for a clean exit.
