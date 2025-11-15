# ziptie-redis-microservice ⚡

> Developed by [TanmayRokde](https://github.com/TanmayRokde) & [pradnyaakumbhar](https://github.com/pradnyaakumbhar)

![Express](https://img.shields.io/badge/express-4.x-black)
![Redis](https://img.shields.io/badge/storage-redis-red)
![License](https://img.shields.io/badge/license-ISC-blue)
![Status](https://img.shields.io/badge/status-production-ready-brightgreen)

> **Ultra-fast key/value URL engine**  
> Create and resolve short URLs with sub-millisecond responses thanks to Redis/Upstash, wrapped in a focused HTTP API.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Installation](#installation)
5. [Running](#running)
6. [Endpoints](#endpoints)
7. [Internals](#internals)
8. [Development Tips](#development-tips)
9. [Operational Notes](#operational-notes)

---

## Overview 🛰️

```
Client ─┐
        │ POST /shorten   ┌──────────────────────────┐
Other   ├────────────────►│ ziptie-redis-microservice│
services│ POST /resolve   └──────────┬───────────────┘
        │                             │
        └────────────── Redis / Upstash storage ─────┘
```

The service focuses solely on short-link lifecycle:

1. Receive payloads `{ ttl, longUrl, userId }`.
2. Generate collision-resistant 12-char keys.
3. Store JSON + metadata in Redis with the requested TTL.
4. Resolve keys to retrieve the original payload + computed `shortUrl`.

## Prerequisites ✅

- Node.js 18+
- Redis instance (localhost, Docker, or Upstash REST tokens)

## Configuration ⚙️

Copy `.env.example` to `.env` and customize:

```
PORT=3000
BASE_SHORT_URL=https://links.ziptie.dev

# Standard Redis TCP
REDIS_URL=redis://localhost:6379
# or granular fields:
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=

# Upstash REST (optional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Providing the Upstash variables toggles the REST client automatically. Otherwise `redis@5` handles the TCP connection.

## Installation 📦

```bash
npm install
```

## Running 🏃

```bash
npm run dev   # if nodemon is configured
# or
npm start
```

Server binds to `PORT` (defaults to `3000`).

## Endpoints 📡

| Method | Path | Description | Sample Payload |
| ------ | ---- | ----------- | -------------- |
| `POST` | `/shorten` | Create a short key. Returns `{ shortKey, expiresIn, shortUrl }`. | `{ "ttl": 3600, "longUrl": "https://example.com", "userId": "user-1" }` |
| `POST` | `/resolve` | Resolve an existing key. Returns the stored JSON plus computed `shortUrl`. | `{ "shortKey": "abc123XYZ789" }` |
| `GET` | `/health` | Liveness endpoint listing server + Redis status. | n/a |

Responses follow standard HTTP semantics: `201` on creation, `404` when a key is missing or expired, `500` for unexpected failures.

## Internals 🧠

- **Key generation:** `src/utils/keyGenerator.js` creates random identifiers.
- **Service layer:** `src/services/urlService.js` (creation) and `src/services/resolveService.js` (lookup) encapsulate business logic.
- **Redis client:** `src/config/redisClient.js` exports `getRedisClient()` that caches the client instance and supports both Upstash REST and native Redis.
- **Routing:** `src/routes/*` exposes `shorten`, `resolve`, and `health` routers mounted in `src/routes/index.js`.

## Development Tips 💡

- Set `DEBUG=redis` to inspect Redis CLI activity (if you enable debug logging).
- `npm run lint` is not defined yet—add ESLint/Prettier if you need formatting checks.
- Write integration tests with `supertest` + `ioredis-mock` to simulate Redis in CI.

## Operational Notes 🛡️

- Upstash client methods implement `get`, `set`, `exists`, and `ping`, mirroring the native Redis client for parity.
- Payloads may be returned as strings or JSON depending on the transport; `resolveService` gracefully handles both.
- Use `Ctrl+C` to stop the service; `closeRedisClient()` drains the connection (no-op for REST mode).
