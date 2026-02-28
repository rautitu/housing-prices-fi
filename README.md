# Housing Prices FI

Housing prices per square meter in Finland by postal code — interactive map visualization.

Data: [Statistics Finland / stat.fi](https://stat.fi) (PxWeb API)

## Architecture

```
stat.fi PxWeb API -> Fetcher -> Transformer -> PostgreSQL
                                                 |
                               Frontend (React + Leaflet) <- API (Bun)
```

| Service    | Description                                | Port (dev) |
|------------|-------------------------------------------|------------|
| postgres   | PostgreSQL 17                              | 5433       |
| api        | Bun REST API                               | 51000      |
| frontend   | React + Leaflet (Nginx)                    | 51100      |
| fetcher    | Price data fetching + transformation       | —          |
| geo-fetch  | Postal code geometries from Statistics Finland | —      |

## Requirements

- Docker & Docker Compose v2
- GNU Make
- (For tests: [Bun](https://bun.sh))

## Quick Start (dev)

```bash
# 1. Clone
git clone https://github.com/rautitu/housing-prices-fi.git
cd housing-prices-fi

# 2. Start all services
make dev-up

# 3. Fetch data (first time)
make dev-fetch
make dev-geo

# 4. Open in browser
open http://localhost:51100
```

## Makefile Commands

| Command         | Description                                  |
|-----------------|----------------------------------------------|
| `make help`     | Show all commands                            |
| `make dev-up`   | Start dev environment                        |
| `make dev-down` | Stop dev environment                         |
| `make dev-fetch`| Run data fetcher (fetch price data)          |
| `make dev-geo`  | Fetch postal code geometries into database   |
| `make dev-logs` | Follow logs                                  |
| `make dev-psql` | Open psql shell                              |
| `make dev-reset`| Clear dev database and recreate              |
| `make test`     | Run unit tests (Bun, no Docker)              |

## Production

```bash
# 1. Copy and edit environment variables
cp .env.prod.example .env.prod
# Change POSTGRES_PASSWORD!

# 2. Start
make prod-up

# 3. Fetch data
make prod-fetch
```

Prod ports by default: API `51000`, frontend `51200`. Configurable in `.env.prod` (`API_PORT`, `FRONTEND_PORT`).

## Environment Variables

| Variable             | Description                    | Dev default        |
|----------------------|--------------------------------|--------------------|
| `ENV`                | Environment name               | `dev`              |
| `POSTGRES_DB`        | Database name                  | `housing_prices`   |
| `POSTGRES_USER`      | DB user                        | `hsp`              |
| `POSTGRES_PASSWORD`  | DB password                    | `hsp_dev_password` |
| `POSTGRES_PORT`      | Postgres port on host          | `5433`             |
| `API_PORT`           | API port on host               | `51000`            |
| `FRONTEND_PORT`      | Frontend port on host          | `51100` / `51200`  |
| `VITE_API_BASE`      | API base URL for frontend      | _(empty = proxy)_  |
| `LOG_LEVEL`          | Log level                      | `debug` / `info`   |

## Tests

```bash
bun test
```

## License

MIT
