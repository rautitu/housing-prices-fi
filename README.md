# Housing Prices FI

Asuntojen neliöhinnat Suomessa postinumeroittain — interaktiivinen karttavisualisointi.

Data: [Tilastokeskus / stat.fi](https://stat.fi) (PxWeb API)

## Arkkitehtuuri

```
stat.fi PxWeb API → Fetcher → Transformer → PostgreSQL
                                                ↓
                              Frontend (React + Leaflet) ← API (Bun)
```

| Palvelu    | Kuvaus                                    | Portti (dev) |
|------------|-------------------------------------------|-------------|
| postgres   | PostgreSQL 17                              | 5433        |
| api        | Bun REST API                               | 51000       |
| frontend   | React + Leaflet (Nginx)                    | 51100       |
| fetcher    | Hintatietojen haku + transformointi         | —           |
| geo-fetch  | Postinumerogeometriat Tilastokeskuksesta    | —           |

## Vaatimukset

- Docker & Docker Compose v2
- GNU Make
- (Testeihin: [Bun](https://bun.sh))

## Pikastart (dev)

```bash
# 1. Kloonaa
git clone https://github.com/rautitu/housing-prices-fi.git
cd housing-prices-fi

# 2. Käynnistä kaikki palvelut
make dev-up

# 3. Hae data (ensimmäisellä kerralla)
make dev-fetch
make dev-geo

# 4. Avaa selaimessa
open http://localhost:51100
```

## Makefile-komennot

| Komento         | Kuvaus                                       |
|-----------------|----------------------------------------------|
| `make help`     | Näytä kaikki komennot                        |
| `make dev-up`   | Käynnistä dev-ympäristö                      |
| `make dev-down` | Pysäytä dev-ympäristö                        |
| `make dev-fetch`| Aja data-fetcher (hae hintatiedot)           |
| `make dev-geo`  | Hae postinumerogeometriat kantaan             |
| `make dev-logs` | Seuraa logeja                                |
| `make dev-psql` | Avaa psql-shell                              |
| `make dev-reset`| Tyhjennä dev-kanta ja luo uudelleen          |
| `make test`     | Aja yksikkötestit (Bun, ei Dockeria)         |

## Tuotanto

```bash
# 1. Kopioi ja muokkaa ympäristömuuttujat
cp .env.prod.example .env.prod
# Vaihda POSTGRES_PASSWORD!

# 2. Käynnistä
make prod-up

# 3. Hae data
make prod-fetch
```

Prod-portit oletuksena: API `51000`, frontend `51200`. Muokattavissa `.env.prod`-tiedostossa (`API_PORT`, `FRONTEND_PORT`).

## Ympäristömuuttujat

| Muuttuja           | Kuvaus                         | Dev oletus         |
|--------------------|--------------------------------|--------------------|
| `ENV`              | Ympäristön nimi                | `dev`              |
| `POSTGRES_DB`      | Tietokannan nimi               | `housing_prices`   |
| `POSTGRES_USER`    | DB-käyttäjä                    | `hsp`              |
| `POSTGRES_PASSWORD`| DB-salasana                    | `hsp_dev_password` |
| `POSTGRES_PORT`    | Postgres-portti hostille       | `5433`             |
| `API_PORT`         | API-portti hostille            | `51000`            |
| `FRONTEND_PORT`    | Frontend-portti hostille       | `51100` / `51200`  |
| `VITE_API_BASE`    | API base URL frontendille      | _(tyhjä = proxy)_  |
| `LOG_LEVEL`        | Lokitaso                       | `debug` / `info`   |

## Testit

```bash
bun test
```

## Lisenssi

MIT
