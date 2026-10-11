# Groceries API

The backend for **Shopmate**, the Flutter groceries app in [binarytracer/groceries_app](https://github.com/binarytracer/groceries_app). It is the **first API** built for that app: a small [NestJS](https://nestjs.com) service that the app talks to for the shopping list and sign-in.

> **Status:** early. Items live in memory and reset on restart (an undone delete goes to the end of the list after a refetch), and the credentials are a single static user. The app is meant to move to a serverless API later, so keep the contract below stable and the mobile app only needs a new base URL.

## What it does

- **Groceries:** list, create, read, update and delete items `{ id, name, quantity, category }`. Items are kept in memory and start with 5 seed items. `GET /:id` and `DELETE /:id` return 404 for an unknown id. `PUT /:id` replaces the item, and **creates it if the id is missing** (an upsert), because the app restores a deleted item (Undo) by PUTting it back.
- **Auth:** `POST /auth` exchanges a username and password for a JWT access token (15 minutes) and a refresh token (7 days). `POST /auth/refresh` swaps a refresh token for a new pair. Every route except `/health`, `/version`, `/auth` and `/auth/refresh` needs `Authorization: Bearer <accessToken>`.
- **Version:** `GET /version` (public) tells the mobile app which release is current, so it can ask users to update from Google Play or the App Store. It returns `latestVersion`, `minSupportedVersion` (older builds must update), `releaseNotes` (what's new in the latest version) and `storeUrls`. The version numbers and store links come from `.env`. The notes come from [release-notes.json](release-notes.json): add an entry for each release, keyed by version. When you publish a new app version, update `APP_LATEST_VERSION` and the notes, then restart the API.
- **Static credentials for now:** `admin` / `password123`, defined in [src/auth/auth.service.ts](src/auth/auth.service.ts). Replace with a real user store before this goes anywhere public.

The full contract, with a Swagger screenshot, is in [docs/api-contract.md](https://github.com/binarytracer/groceries_app/blob/main/docs/api-contract.md) in the app repo. When the API is running, the live version is at `/docs`.

## Project layout

```
src/
  app.module.ts      # root module, loads and validates the environment
  app.controller.ts  # GET /health only
  auth/              # login, refresh, JWT guard (applied to every route)
  groceries/         # groceries controller, service and module
  config/            # environment variable validation
  version/           # GET /version: latest mobile release, notes, store links
```

## Setup

```bash
yarn install
cp .env.example .env
```

Then edit `.env`. Variables are read through `@nestjs/config` and checked at startup, so the app refuses to start if one is missing or invalid:

| Variable | Default | Notes |
|---|---|---|
| `JWT_SECRET` | none, **required** | At least 16 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | `3000` | Must be a valid port |
| `IP` | `localhost` | Only used in the startup log message |
| `APP_LATEST_VERSION` | `1.0.0` | Newest mobile app release, like `1.2.3` |
| `APP_MIN_VERSION` | `1.0.0` | Builds older than this must update |
| `ANDROID_STORE_URL`, `IOS_STORE_URL` | empty (`null`) | Store links, must be valid URLs |

## Run

```bash
yarn start:dev     # watch mode
yarn start         # once
yarn start:prod    # runs the built output in dist/
```

Swagger UI is at `http://localhost:3000/docs`. Sign in with `POST /auth`, copy the `accessToken`, click **Authorize** and paste it to try the other routes.

## Connect the mobile app

Set `API_URL` in the app's env file (`env/dev.json` in the app repo) and run it with `--dart-define-from-file=env/dev.json`. See the [app README](https://github.com/binarytracer/groceries_app#readme) for the details.

| App runs on | `API_URL` |
|---|---|
| Android emulator | `http://10.0.2.2:3000` |
| iOS simulator, desktop, web | `http://localhost:3000` |
| Physical device | `http://<your machine's LAN IP>:3000` |

## Tests

```bash
yarn test        # unit
yarn test:e2e    # end to end
yarn test:cov    # coverage
```

The scripts set `NODE_OPTIONS=--experimental-vm-modules` because `@nestjs/swagger` is an ES module and jest can't load it otherwise. Run them through `yarn`, not bare `npx jest`.
