# Deployment Guide

This document covers the full production deployment of the DropBroker frontend — four Vite + Module Federation apps hosted on S3 + CloudFront.

---

## Architecture Overview

| App | S3 Bucket | CloudFront Domain | Distribution ID |
|-----|-----------|-------------------|-----------------|
| shell | dropbroker-shell-prod | d17fb247fspdj3.cloudfront.net | EJ0HA5NJ6ECDF |
| owner-app | dropbroker-owner-prod | d1vsdiyf7s2gaw.cloudfront.net | E1VUCIXHX6ZDVZ |
| admin-app | dropbroker-admin-prod | dfbytklcu0ht8.cloudfront.net | E3UR2A2GM5RTAJ |
| tenant-app | dropbroker-tenant-prod | d1ewx2zfo51gcc.cloudfront.net | E2BE97NRKZDLMC |

The **shell** is the entry point users visit. It loads `remoteEntry.js` from the three remote distributions at runtime via Module Federation.

API calls flow: `Browser → shell CloudFront (/api/*) → API Gateway`  
No direct browser-to-API-Gateway calls — this avoids CORS entirely.

---

## Prerequisites

- AWS CLI installed and configured (`aws configure`)
- Node.js 18+
- AWS account with access to S3, CloudFront

---

## One-Time Setup (Already Done)

### 1. S3 Buckets

Four buckets were created, one per app:

```
dropbroker-shell-prod
dropbroker-owner-prod
dropbroker-admin-prod
dropbroker-tenant-prod
```

Each bucket has:
- **Block Public Access** — all settings ON (CloudFront uses OAC, not public URLs)
- **Static website hosting** — disabled (CloudFront handles routing)

### 2. CloudFront Distributions

One distribution per bucket. Settings used for each:

- **Origin:** S3 bucket (select from list, not the website endpoint)
- **Origin access:** Origin Access Control (OAC) — let CloudFront auto-create and write the bucket policy
- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Default root object:** `index.html`
- **Custom error responses:**
  - 403 → `/index.html`, HTTP 200
  - 404 → `/index.html`, HTTP 200
  (Required for SPA client-side routing — without this, page refreshes return 403)
- **WAF:** disabled (optional, adds cost)

### 3. API Proxy Behavior on Shell Distribution

The shell CloudFront distribution has an extra cache behavior so API calls don't cross origins:

- **Path pattern:** `/api/*`
- **Origin:** `sh4jxvfw36.execute-api.ap-southeast-2.amazonaws.com` (custom HTTPS origin)
- **Cache policy:** CachingDisabled (`4135ea2d-6df8-44a3-9df3-4b5a84be39ad`)
- **Origin request policy:** AllViewerExceptHostHeader (`b689b0a8-53d0-40ab-baf2-68738e2966ac`)
- **Allowed methods:** GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

This was added via CLI:

```bash
# Get current config + ETag
aws cloudfront get-distribution-config --id EJ0HA5NJ6ECDF > /tmp/shell-dist.json

# Edit /tmp/shell-config.json to add the origin + behavior (see below)

# Apply update
aws cloudfront update-distribution \
  --id EJ0HA5NJ6ECDF \
  --distribution-config file:///tmp/shell-config-updated.json \
  --if-match <ETag>
```

### 4. CORS Headers on Remote Distributions

The shell fetches `remoteEntry.js` cross-origin from the three remote distributions. Each remote (owner, admin, tenant) has the `Managed-CORS-With-Preflight` response headers policy on its default cache behavior:

- **Policy ID:** `5cc3b908-e619-4b99-88e5-2cf7f45965bd`
- **Policy name:** Managed-CORS-With-Preflight

Added via CLI:

```bash
for id in E3UR2A2GM5RTAJ E1VUCIXHX6ZDVZ E2BE97NRKZDLMC; do
  etag=$(aws cloudfront get-distribution-config --id $id --query 'ETag' --output text)
  aws cloudfront get-distribution-config --id $id --query 'DistributionConfig' > /tmp/dist-$id.json
  # add ResponseHeadersPolicyId to DefaultCacheBehavior in the JSON
  aws cloudfront update-distribution --id $id \
    --distribution-config file:///tmp/dist-$id-updated.json \
    --if-match $etag
done
```

---

## Environment Files

Only two env files exist across the whole project:

**`shell/.env`**
```
VITE_API_URL=
# Empty — Vite dev proxy forwards /api/* to API Gateway in dev,
# CloudFront /api/* behavior handles it in production.
```

**`owner-app/.env`**
```
VITE_GOOGLE_MAPS_API_KEY=<key>
```

No `.env.production` files are needed. `VITE_API_URL` is empty in both dev and production (relative calls work in both environments). Vite loads `.env` in all modes, so the Google Maps key is available in production builds automatically.

---

## Deploying Changes (Routine)

Run these steps whenever you change any app.

### Step 1 — Build

```bash
# Build all four apps
cd db-frontend/shell && npm run build
cd db-frontend/owner-app && npm run build
cd db-frontend/admin-app && npm run build
cd db-frontend/tenant-app && npm run build
```

Or build only the app(s) you changed.

### Step 2 — Upload to S3

```bash
# Replace <app> and <bucket> as needed
aws s3 sync db-frontend/shell/dist       s3://dropbroker-shell-prod  --delete
aws s3 sync db-frontend/owner-app/dist   s3://dropbroker-owner-prod  --delete
aws s3 sync db-frontend/admin-app/dist   s3://dropbroker-admin-prod  --delete
aws s3 sync db-frontend/tenant-app/dist  s3://dropbroker-tenant-prod --delete
```

`--delete` removes files from S3 that no longer exist in the build output (stale hashed filenames).

### Step 3 — Invalidate CloudFront

CloudFront caches files at its edge nodes. After uploading, you must invalidate the cache so users get the new files:

```bash
for id in EJ0HA5NJ6ECDF E1VUCIXHX6ZDVZ E2BE97NRKZDLMC E3UR2A2GM5RTAJ; do
  aws cloudfront create-invalidation --distribution-id $id --paths "/*"
done
```

Invalidation takes ~1–2 minutes. You can monitor progress in the AWS Console under each distribution's **Invalidations** tab.

### Step 4 — Verify

Open `https://d17fb247fspdj3.cloudfront.net` in a browser.  
Use **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows) to bypass the browser cache on first check.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Login returns HTML instead of JSON | `VITE_API_URL` is set to the API Gateway URL directly — browser calls bypass the CloudFront proxy and get CORS errors | Set `VITE_API_URL=` (empty) in all `.env.production` files, rebuild |
| `remoteEntry.js` blocked by CORS | Remote distributions missing CORS response headers policy | Add `Managed-CORS-With-Preflight` to default behavior of owner, admin, tenant distributions |
| Page refresh returns 403 | CloudFront has no custom error response for 403 | Add custom error: 403 → `/index.html`, HTTP 200 |
| Old version still showing after deploy | CloudFront cache not invalidated | Run `create-invalidation --paths "/*"` on affected distribution |
| Remote app not loading in shell | Wrong port in dev, or wrong `remoteEntry.js` URL in `shell/vite.config.js` `prod` block | Check distribution domain names match what's in `REMOTE_URLS.prod` in `vite.config.js` |

---

## Remote URLs in vite.config.js

`shell/vite.config.js` has hardcoded CloudFront domains for the production remotes. If you ever recreate a distribution, update this file:

```js
const REMOTE_URLS = {
  dev: {
    ownerApp:  'http://localhost:3001/assets/remoteEntry.js',
    adminApp:  'http://localhost:3002/assets/remoteEntry.js',
    tenantApp: 'http://localhost:3003/assets/remoteEntry.js',
  },
  prod: {
    ownerApp:  'https://d1vsdiyf7s2gaw.cloudfront.net/assets/remoteEntry.js',
    adminApp:  'https://dfbytklcu0ht8.cloudfront.net/assets/remoteEntry.js',
    tenantApp: 'https://d1ewx2zfo51gcc.cloudfront.net/assets/remoteEntry.js',
  },
}
```
