# Running the App Locally

## Port Map

| App        | Port   | Role                              |
|------------|--------|-----------------------------------|
| `shell`    | 3000   | Host app — open this in browser   |
| `owner-app`| 3001   | Remote — serves owner pages       |
| `admin-app`| 3002   | Remote — serves admin pages       |

---

## First-Time Setup

Install dependencies from the root workspace:

```bash
cd db-frontend
npm install
```

---

## Starting the App

The remotes (`owner-app`, `admin-app`) must be **built first** then served via `vite preview`. The shell runs in dev mode.

### Step 1 — Build and serve owner-app (port 3001)

```bash
cd db-frontend/owner-app
npm run build
npm run preview
```

### Step 2 — Build and serve admin-app (port 3002)

```bash
cd db-frontend/admin-app
npm run build
npm run preview
```

### Step 3 — Start the shell (port 3000)

```bash
cd db-frontend/shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

---

## Why Remotes Need `build` + `preview`

The shell loads remotes via Module Federation by fetching `remoteEntry.js` from their preview server:

```
http://localhost:3001/assets/remoteEntry.js  ← owner-app
http://localhost:3002/assets/remoteEntry.js  ← admin-app
```

`vite dev` does not produce a `remoteEntry.js` file — only `vite build` does. So remotes must always be built before the shell can use them.

The shell itself uses `vite dev` because it benefits from hot module reload during development.

---

## After Changing a Remote

Any time you edit code in `owner-app` or `admin-app`, you need to rebuild and restart its preview server:

```bash
# owner-app
cd db-frontend/owner-app
npm run build && npm run preview

# admin-app
cd db-frontend/admin-app
npm run build && npm run preview
```

Then do a **hard refresh** in the browser (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows) to clear the cached remote bundle.

---

## After Changing the UI Package

`@dropbroker/ui` is a source package — no build step needed. Changes to `ui/src/ui.css` or components are picked up automatically by:

- The **shell** on the next hot reload.
- The **remotes** on the next `npm run build`.

---

## Environment Variables

The shell reads from `db-frontend/shell/.env`:

```
VITE_API_URL=
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

`VITE_API_URL` is intentionally left empty in development — the Vite proxy in `shell/vite.config.js` forwards all `/api/*` requests to the AWS API Gateway automatically.

---

## Common Issues

**`Port XXXX is already in use` error**
→ Another process is holding the port. Kill it then retry:
```bash
# Kill whatever is on port 3001
lsof -ti:3001 | xargs kill -9

# Kill whatever is on port 3002
lsof -ti:3002 | xargs kill -9
```
Both `package.json` scripts use `--strictPort` so Vite will error immediately instead of silently moving to a different port.

**Remote not loading / blank page**
→ Make sure `owner-app` and `admin-app` preview servers are running on the correct ports.

**Changes not reflected after editing a remote**
→ Rebuild the remote (`npm run build`) and hard-refresh the browser.

**`No QueryClient set` error**
→ `@tanstack/react-query` must be listed in `shared` in both the shell and the remote's `vite.config`. Check both configs.

**Page refresh returns 404**
→ Only the shell's routes are served by the dev server. Refreshing on `/owner/...` or `/admin/...` is handled by the Vite proxy bypass — make sure `shell/vite.config.js` is up to date.
