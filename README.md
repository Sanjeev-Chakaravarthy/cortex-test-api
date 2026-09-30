# cortex-test-api

Minimal Express API for testing Cortex V0.4 health monitoring.

## Endpoints

- `GET /` — Service info
- `GET /health` — Health check (200 = healthy, 500 = failing)
- `GET /api/test` — API test
- `POST /admin/fail` — Toggle to failure mode
- `POST /admin/recover` — Recover from failure mode

## Usage

```bash
npm install
npm start
```
