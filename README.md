# ✅ Todo REST API

A REST API for managing tasks, built with **Express 5 and TypeScript**. Supports priorities, completion status, text search, filtering, pagination, and task statistics.

## Features

- Create, read, replace, partially update, and delete tasks.
- Filter by completion status and priority; search task text without case sensitivity.
- Paginate results with metadata and a maximum page size of 100.
- Validate request bodies, query parameters, and identifiers.
- Return consistent JSON responses and meaningful HTTP status codes.
- Apply Helmet headers, CORS, and request logging.
- Run HTTP regression tests against an isolated local server.

## Stack

Node.js · Express 5 · TypeScript · express-validator · Helmet · CORS · Morgan

## Run locally

Requires **Node.js 20+** and npm.

```bash
git clone https://github.com/VeraI98/todo-rest-api.git
cd todo-rest-api
npm ci
npm run dev
```

The server runs at **http://localhost:3001** by default. Set `PORT` to use another port:

```bash
PORT=4000 npm run dev
```

No API key, database, or `.env` file is required.

### Production

```bash
npm run build
NODE_ENV=production npm start
```

## Endpoints

| Method | Path               | Description                              | Success |
| ------ | ------------------ | ---------------------------------------- | ------- |
| GET    | `/`                | API information                          | 200     |
| GET    | `/api/health`      | Health and uptime                        | 200     |
| GET    | `/api/todos`       | List, filter, search, and paginate tasks | 200     |
| GET    | `/api/todos/stats` | Task statistics                          | 200     |
| GET    | `/api/todos/:id`   | Get a task                               | 200     |
| POST   | `/api/todos`       | Create a task                            | 201     |
| PUT    | `/api/todos/:id`   | Replace all editable fields              | 200     |
| PATCH  | `/api/todos/:id`   | Update selected fields                   | 200     |
| DELETE | `/api/todos/:id`   | Delete a task                            | 204     |

Invalid requests return **400**. Unknown routes or tasks return **404**. Unexpected server errors return **500**.

## Task model

| Field       | Type                    | Behavior                                  |
| ----------- | ----------------------- | ----------------------------------------- |
| `id`        | number                  | Generated positive integer                |
| `text`      | string                  | Trimmed, nonempty, up to 1,000 characters |
| `completed` | boolean                 | Defaults to `false` on creation           |
| `priority`  | `low`, `medium`, `high` | Defaults to `medium` on creation          |
| `createdAt` | ISO date string         | Generated on creation                     |
| `updatedAt` | ISO date string         | Added on update                           |

POST accepts `text` and optional `priority`. PUT requires `text`, `completed`, and `priority`. PATCH requires at least one of those fields. Unknown body fields are rejected. Completion values in JSON must be booleans, not strings.

## Examples

### Create a task

```bash
curl -X POST http://localhost:3001/api/todos \
  -H 'Content-Type: application/json' \
  -d '{"text":"Prepare portfolio","priority":"high"}'
```

### Mark a task as completed

```bash
curl -X PATCH http://localhost:3001/api/todos/1 \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'
```

### Replace a task

```bash
curl -X PUT http://localhost:3001/api/todos/1 \
  -H 'Content-Type: application/json' \
  -d '{"text":"Publish portfolio","completed":false,"priority":"medium"}'
```

### Filter and paginate

```bash
curl 'http://localhost:3001/api/todos?completed=false&priority=high&search=portfolio&page=1&limit=10'
```

Supported query parameters: `completed` (`true` or `false`), `priority`, `search`, `page` (1–1,000,000), and `limit` (1–100).

Example list response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

DELETE returns an empty response body.

## Structure

| Path               | Responsibility                           |
| ------------------ | ---------------------------------------- |
| `src/app.ts`       | Express middleware and route composition |
| `src/index.ts`     | Server startup                           |
| `src/routes/`      | Endpoint definitions                     |
| `src/controllers/` | HTTP requests and responses              |
| `src/services/`    | Task storage and business logic          |
| `src/middleware/`  | Validation and error handling            |
| `src/types/`       | TypeScript models                        |
| `tests/`           | HTTP regression tests                    |

## Checks

```bash
npm run type-check
npm test
```

`npm test` builds the project and runs 13 HTTP scenarios covering CRUD, validation, filtering, pagination, statistics, malformed JSON, and error responses. Test data exists only in the test process.

## Limitations

- **In-memory storage:** tasks disappear when the server restarts. Separate server instances do not share tasks.
- **No authentication:** all clients access the same task collection.
- **No frontend:** interact with the API using curl, Postman, or an HTTP client.
- This repository has no configured public deployment.

This educational project demonstrates REST API design and TypeScript. Persistent storage and user accounts are outside its current scope.

## Author

**Vera Ilyasova** · [VeraI98](https://github.com/VeraI98)
