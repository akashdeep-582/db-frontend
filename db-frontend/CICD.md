# CI/CD Guide

This document covers the enterprise-grade CI/CD process for DropBroker frontend — from a developer writing code to it reaching production.

---

## Mental Model

Code cannot reach production without passing through automated gates and a human approval. Every step is enforced, not optional.

```
Developer → PR → CI checks → Code Review → Merge → Staging deploy → Manual approval → Prod deploy
```

---

## Branch Strategy

```
main          ← production code. Protected. Never push directly.
staging       ← mirrors the staging environment. PRs merge here before main.
feature/*     ← daily feature work  (e.g. feature/tenant-browse-page)
bugfix/*      ← bug fixes           (e.g. bugfix/visit-status-display)
hotfix/*      ← emergency prod fix  (e.g. hotfix/login-cors)
```

### Rules

- `main` and `staging` are **protected branches** — no direct pushes, ever.
- All work starts on a `feature/*` or `bugfix/*` branch off `staging`.
- `feature/*` → PR → `staging` → tested by QA → PR → `main` → production.
- `hotfix/*` branches off `main` directly and gets PRs into both `main` and `staging`.

---

## Branch Protection Rules (GitHub)

Set these in: GitHub repo → Settings → Branches → Add rule

### For `main`

| Setting | Value |
|---------|-------|
| Require pull request before merging | ✅ |
| Required approvals | 2 |
| Dismiss stale reviews on new commits | ✅ |
| Require status checks to pass | ✅ (lint, test, build) |
| Require branch to be up to date before merge | ✅ |
| Restrict who can push | lead engineers only |

### For `staging`

| Setting | Value |
|---------|-------|
| Require pull request before merging | ✅ |
| Required approvals | 1 |
| Require status checks to pass | ✅ (lint, test, build) |

The **Merge button on GitHub is greyed out** until all required checks pass and the required number of people have approved. This is enforced by GitHub — no exceptions.

---

## Environments

GitHub Environments (repo → Settings → Environments) add a named context to deployments and allow approval gates.

### `staging` environment
- No approval required
- Deploys automatically when code merges to `staging` branch
- URL: `https://staging.dropbroker.com` (or the staging CloudFront domain)

### `production` environment
- **Required reviewers:** release manager / lead engineer (named people)
- Pipeline pauses at the approval step and sends a notification
- Only after a named person clicks Approve does the deploy proceed
- URL: `https://d17fb247fspdj3.cloudfront.net`

---

## Secrets

CI/CD pipelines need AWS credentials to upload to S3 and invalidate CloudFront. These are stored as **GitHub Secrets** — never in code or config files.

GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | `ap-southeast-2` |

In workflow YAML these are referenced as `${{ secrets.AWS_ACCESS_KEY_ID }}`. GitHub masks them in logs.

### IAM Policy for the CI user

Create a dedicated IAM user for CI (not your personal account). Attach a policy that allows only what CI needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::dropbroker-shell-prod",
        "arn:aws:s3:::dropbroker-shell-prod/*",
        "arn:aws:s3:::dropbroker-owner-prod",
        "arn:aws:s3:::dropbroker-owner-prod/*",
        "arn:aws:s3:::dropbroker-admin-prod",
        "arn:aws:s3:::dropbroker-admin-prod/*",
        "arn:aws:s3:::dropbroker-tenant-prod",
        "arn:aws:s3:::dropbroker-tenant-prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

---

## Pipeline 1 — CI (Pull Request Checks)

**Trigger:** any PR opened or updated against `staging` or `main`  
**File:** `.github/workflows/ci.yml`

```
PR opened / new commit pushed
        │
        ▼
┌───────────────────────┐
│  Job 1: Lint & Types  │  ~1 min
│  eslint               │
│  tsc --noEmit         │
└───────────────────────┘
        │ fail → PR blocked, reviewer notified
        ▼
┌───────────────────────┐
│  Job 2: Build         │  ~3 min
│  build all 4 apps     │
│  fails if broken      │
└───────────────────────┘
        │ fail → PR blocked
        ▼
┌───────────────────────┐
│  Job 3: Preview Deploy│  ~2 min
│  upload to temp S3    │
│  post URL in PR       │
└───────────────────────┘
        │
        ▼
   All checks green → merge button unlocks
```

The reviewer sees a live preview URL posted as a comment on the PR. They can click it and manually test the feature before approving.

### Workflow YAML

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, staging]

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
        working-directory: db-frontend
      - run: npm run lint --workspaces --if-present
        working-directory: db-frontend
      - run: npm run typecheck --workspaces --if-present
        working-directory: db-frontend

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
        working-directory: db-frontend
      - run: |
          npm run build -w shell
          npm run build -w owner-app
          npm run build -w admin-app
          npm run build -w tenant-app
        working-directory: db-frontend
```

---

## Pipeline 2 — Deploy to Staging

**Trigger:** push to `staging` branch (i.e. a PR was merged into staging)  
**File:** `.github/workflows/deploy-staging.yml`

```
Merge to staging
      │
      ▼
┌──────────────────┐
│  Build (staging) │
└──────────────────┘
      │
      ▼
┌───────────────────────────┐
│  Upload to staging S3     │
│  dropbroker-shell-staging │
│  dropbroker-owner-staging │
│  etc.                     │
└───────────────────────────┘
      │
      ▼
┌───────────────────────────┐
│  Invalidate staging CF    │
└───────────────────────────┘
      │
      ▼
┌───────────────────────────┐
│  Notify (Slack / email)   │
│  "Staging updated — test" │
└───────────────────────────┘
```

### Workflow YAML

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy — Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
        working-directory: db-frontend
      - run: |
          npm run build -w shell
          npm run build -w owner-app
          npm run build -w admin-app
          npm run build -w tenant-app
        working-directory: db-frontend

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload to S3
        working-directory: db-frontend
        run: |
          aws s3 sync shell/dist      s3://dropbroker-shell-staging  --delete
          aws s3 sync owner-app/dist  s3://dropbroker-owner-staging  --delete
          aws s3 sync admin-app/dist  s3://dropbroker-admin-staging  --delete
          aws s3 sync tenant-app/dist s3://dropbroker-tenant-staging --delete

      - name: Invalidate CloudFront
        run: |
          for id in <STAGING_SHELL_ID> <STAGING_OWNER_ID> <STAGING_ADMIN_ID> <STAGING_TENANT_ID>; do
            aws cloudfront create-invalidation --distribution-id $id --paths "/*"
          done
```

---

## Pipeline 3 — Deploy to Production

**Trigger:** push to `main` branch (i.e. a PR from `staging` was merged into `main`)  
**File:** `.github/workflows/deploy-prod.yml`

```
Merge to main
      │
      ▼
┌──────────────────┐
│  Build (prod)    │
└──────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│  ⏸  Manual Approval Gate            │
│  GitHub pauses here                  │
│  Sends notification to release mgr  │
│  Pipeline waits (up to 30 days)      │
│  Release manager clicks "Approve"    │
└──────────────────────────────────────┘
      │ only after approval
      ▼
┌──────────────────────────┐
│  Upload to prod S3       │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│  Invalidate prod CF      │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│  Post deploy summary                 │
│  - commit SHA                        │
│  - who approved + timestamp          │
│  - production URL                    │
└──────────────────────────────────────┘
```

The approval gate comes from the `environment: production` line in the YAML — GitHub automatically enforces the required reviewers configured on that environment.

### Workflow YAML

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy — Production

on:
  push:
    branches: [main]

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
        working-directory: db-frontend
      - run: |
          npm run build -w shell
          npm run build -w owner-app
          npm run build -w admin-app
          npm run build -w tenant-app
        working-directory: db-frontend
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: |
            db-frontend/shell/dist
            db-frontend/owner-app/dist
            db-frontend/admin-app/dist
            db-frontend/tenant-app/dist

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    environment: production     # ← this line enforces the approval gate
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload to S3
        run: |
          aws s3 sync shell/dist      s3://dropbroker-shell-prod  --delete
          aws s3 sync owner-app/dist  s3://dropbroker-owner-prod  --delete
          aws s3 sync admin-app/dist  s3://dropbroker-admin-prod  --delete
          aws s3 sync tenant-app/dist s3://dropbroker-tenant-prod --delete

      - name: Invalidate CloudFront
        run: |
          for id in EJ0HA5NJ6ECDF E1VUCIXHX6ZDVZ E2BE97NRKZDLMC E3UR2A2GM5RTAJ; do
            aws cloudfront create-invalidation --distribution-id $id --paths "/*"
          done
```

---

## Day-to-Day Developer Flow

```
1.  git checkout staging
    git pull origin staging
    git checkout -b feature/my-feature

2.  write code, commit, push

3.  open PR on GitHub: feature/my-feature → staging

4.  CI runs automatically
    - lint & type check
    - build check
    - preview URL posted as PR comment

5.  request review from a teammate

6.  teammate reviews code + clicks the preview URL to test manually

7.  teammate approves the PR

8.  all CI checks green + approval = merge button unlocks

9.  merge PR into staging

10. staging pipeline runs automatically
    staging environment updated in ~5 min

11. QA / product owner tests on staging

12. open PR: staging → main

13. same CI checks run again on this PR

14. lead engineer reviews + approves

15. merge PR into main

16. prod pipeline starts — builds succeed — pauses at approval gate
    release manager gets a GitHub notification

17. release manager reviews the deploy summary, clicks Approve

18. prod deploys in ~5 min

19. verify at https://d17fb247fspdj3.cloudfront.net
```

---

## Rollback

If production breaks after a deploy:

**Option 1 — Redeploy previous commit (fastest)**
```bash
git checkout main
git revert HEAD --no-edit
git push origin main
# triggers the prod pipeline again with the reverted code
```

**Option 2 — Re-upload previous build from S3 version history**  
If S3 versioning is enabled on the buckets, you can restore a previous object version from the AWS Console without any code changes.

**Option 3 — Revert the PR on GitHub**  
GitHub has a "Revert" button on merged PRs. This creates a new revert PR automatically.

---

## Setup Checklist (To Implement This)

- [ ] Create `staging` branch from current `main`
- [ ] Add branch protection rules on `main` and `staging` (GitHub Settings → Branches)
- [ ] Create GitHub Environments: `staging` and `production` (Settings → Environments)
- [ ] Add required reviewers to `production` environment
- [ ] Create dedicated IAM user for CI with the minimal policy above
- [ ] Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` to GitHub Secrets
- [ ] Create staging S3 buckets and CloudFront distributions (mirror of prod setup)
- [ ] Add `.github/workflows/ci.yml`
- [ ] Add `.github/workflows/deploy-staging.yml`
- [ ] Add `.github/workflows/deploy-prod.yml`
- [ ] Add `lint` and `typecheck` scripts to each app's `package.json`
