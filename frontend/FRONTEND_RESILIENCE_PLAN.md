# Frontend Resilience & Architecture Plan

Goal: design a frontend that is robust, fault-tolerant, and user-friendly even under partial failures (network problems, backend errors, slow devices). This document gives concrete recommendations, folder layout, tooling, runtime patterns, testing, deployment and monitoring guidance to make the frontend "non-crashable" in practice.

## High-level contract

- Inputs: HTTP/WS APIs from backend, user interactions
- Outputs: UI state, API calls, events to backend (analytics, telemetry)
- Success: UI remains usable with graceful degradation when services fail; errors surfaced clearly and recoverably to users; automated alerts for errors.
- Error modes: network failures, 5xx/4xx responses, auth expiry, long-running requests, resource exhaustion on client (memory/CPU)

## Recommended tech stack

- Framework: React (18+) or Preact (if extreme size/Perf is required).
- Language: TypeScript (catch bugs early, better DX).
- Build: Vite for dev/fast builds, esbuild where applicable.
- UI library: Tailwind CSS for utility-first or component library (Radix, headless UI) + design tokens.
- State / Data fetching:
  - Local UI state: React useState/useReducer or Zustand for small/medium apps.
  - Server state: React Query (TanStack Query) or SWR — built-in retries, cache, background refresh, deduping.
- Routing: React Router (or framework router if using Next.js / Remix).
- Error reporting: Sentry (browser) + session replay (LogRocket or Sentry Replay optional).
- CI: GitHub Actions (lint, typecheck, tests, build, deploy).
- E2E: Playwright (recommended) or Cypress.
- Accessibility: axe-core + lint rules.

## App architecture choices

- SPA vs SSR: For resilience, a hybrid approach is best:
  - Use SSR (Next.js/Remix) for the landing pages and critical pages — improves first load and SEO.
  - Use CSR for app interactions (editor, realtime sessions).
- If using Next.js: use App Router + React Server Components where appropriate. If using plain React+Vite: provide a static entry and focus on client resilience.

## Folder structure (example)

```
frontend/
├─ package.json
├─ vite.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ index.css
│  ├─ pages/
│  │  ├─ Home/
│  │  │  ├─ Home.tsx
│  │  │  └─ Home.css
│  │  └─ Health.tsx
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ sessions/
│  │  └─ execute/
│  ├─ components/
│  │  └─ ErrorBoundary.jsx
│  ├─ hooks/
│  │  └─ useNetwork.ts
│  ├─ services/
│  │  ├─ api.ts          // fetch wrapper with timeouts, retries, interceptors
│  │  └─ websocket.ts
│  ├─ stores/
│  ├─ telemetry/
│  │  └─ sentry.ts
│  └─ utils/
│     ├─ retry.ts
│     └─ format.ts
└─ public/
```

## Resilience patterns (runtime)

1. Error Boundaries
   - Wrap top-level app and critical UI subtrees in React Error Boundaries.
   - For recoverable subtrees, provide a retry button that re-mounts the subtree.
2. API layer with resiliency
   - Central fetch wrapper (`services/api.ts`) that enforces:
     - Global timeout (e.g., 10s for non-critical, 30s for longer jobs).
     - Retries with exponential backoff for idempotent GET/HEAD/OPTIONS requests.
     - AbortController support to cancel stale requests on route changes.
     - Circuit breaker for endpoints that keep failing (open circuit after N failures and serve stale cache/fallback UI).
     - Bulkhead isolation: isolate heavy operations (code execution, large file downloads) to separate worker queue or Web Worker.
3. Server-state cache + background refresh
   - Use React Query with sensible staleTime/cacheTime and background refetch to avoid hammering backend.
   - Serve stale while revalidating (stale-while-revalidate) UX to keep UI snappy.
4. Graceful degradation
   - If backend queue (RabbitMQ) or code execution service is unavailable, still allow session creation and collaborative editing (local-first) and queue tasks when backend recovers.
   - For non-critical features (history, analytics), show muted UI with retry or offline queue.
5. WebSocket resiliency
   - Exponential reconnect with jitter.
   - Heartbeat/ping/pong and automatic subscription replay on reconnect.
   - Fallback to HTTP polling for critical updates when WS is blocked.
6. Optimistic updates with rollback
   - For actions like join session or small edits, optimistically update UI and rollback on server rejection; show clear error and retry option.
7. Input validation and sanitization
   - Validate on client first (avoid unnecessary requests) and always trust server validation as the source of truth.
8. Memory & CPU safety
   - Avoid keeping huge blobs in memory; use streams where possible.
   - Use Web Workers for heavy processing (syntax highlighting, code analysis) to keep UI thread responsive.

## Offline & caching strategy

- Use a Service Worker (Workbox recommended) with the following caching rules:
  - Static assets (JS/CSS/images): Cache-first with versioned cache; keep short TTL for critical assets during development.
  - Navigation / HTML shell: Network-first with fallback to cached shell.
  - API GET requests: stale-while-revalidate, cache GETs for short period (e.g., 30s-5m) depending on data volatility.
  - POST/PUT/DELETE: enqueue via Background Sync or IndexedDB when offline (persist action + optimistic UI). Replay queue after connectivity restored.
- Storage: IndexedDB (via idb library) for persistence of unsent actions, small caches, and execution results.

## Observability & monitoring

- Client-side error tracking: Sentry (capture exceptions, performance traces, session replay optional).
- Logging: send structured logs for important events (user action failures, retries, circuit open/close) to a logging endpoint (batched).
- Metrics: collect RUM (first paint, ttfb, largest contentful paint) with Prometheus-compatible or commercial RUM tooling.
- Uptime: Ping important endpoints from CI or external uptime monitor.
- Alerts: set alerts for high error rate, increase in JS exceptions, or large drops in success metrics.

## Testing strategy

- Unit tests: Jest + React Testing Library for components and hooks (cover ErrorBoundary, retry logic, and api wrapper).
- Integration: test React Query behavior, API wrapper behaviors (mock failures, timeouts).
- E2E tests: Playwright full-flow tests (login, create session, run code, reconnect scenarios, offline replay).
- Chaos tests (optional): simulate delayed responses, dropped WebSocket, and service downtime in staging to validate resilience.

## CI/CD

- Pipeline steps (GitHub Actions recommended):
  1. Checkout
  2. Install (pnpm/npm ci)
  3. Lint + typecheck (tsc)
  4. Unit tests
  5. Build (vite build)
  6. Integration/E2E (optional in separate job against staging)
  7. Publish artifacts (static site) to hosting (Vercel/Netlify/Cloudflare Pages) or build Docker image and push to registry.
  8. Canary deploy + health checks before full rollout.

## Deployment options

- Static SPA: host built assets on Cloudflare Pages, Netlify, or an S3+CloudFront CDN. Use edge caching and short cache invalidation on deploys.
- SSR (Next.js): host on Vercel or a server capable of SSR; enable incremental static regeneration for pages that need freshness.
- Containerized: build minimal container with node serving static assets (or with SSR) and deploy to Kubernetes or container app.

## Security hardening

- Use HTTP-only, Secure cookies for session (if using cookies). Prefer JWT + refresh tokens stored in secure storage with rotation.
- CSP header, X-Frame-Options, HSTS — set via server (Nginx) or meta tags.
- Rate-limit sensitive UI actions (login attempts) at backend; throttle from client when necessary.
- Do not expose internal implementation details in root endpoint in production — make the root response minimal in production (e.g., a simple status). Only expose full endpoint listing in development or behind auth.
- Sanitize any HTML or user-supplied content.

## Performance

- Code-splitting: split heavy components (editor, sandbox) and load lazily.
- Use dynamic imports for the code editor, syntax highlighting, or large libs.
- Keep bundle size budgets (e.g., < 150KB gzipped for main bundle if feasible).
- Use CDN for static assets and long-term caching with content-hash file names.

## Developer experience & safety nets

- Hot reloading (Vite) for fast iteration.
- Strict TypeScript config and ESLint rules.
- Storybook for isolated component development and visual regression tests.

## Concrete implementation suggestions (small snippets & rules)

1. API wrapper (simplified idea)

```ts
// services/api.ts
import axios from "axios";
import retry from "../utils/retry";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

client.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config || !config.retry) return Promise.reject(error);
  config.__retryCount = config.__retryCount || 0;
  if (config.__retryCount >= config.retry) return Promise.reject(error);
  config.__retryCount++;
  await retry(config.__retryCount);
  return client(config);
});

export default client;
```

2. Error Boundary (React)

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    /* send to Sentry */
  }
  render() {
    if (this.state.hasError)
      return <Fallback onRetry={() => this.setState({ hasError: false })} />;
    return this.props.children;
  }
}
```

3. WebSocket reconnect pattern

- Connect with backoff, limit attempts, use jitter, and re-auth on reconnect.

## UX guidelines for failures

- Show clear, actionable messages ("Unable to connect to realtime service — Retry"), not raw errors.
- Provide retry controls, offline indicators, and when an operation is queued, show its status.
- Avoid blocking the entire UI for one failing widget.

## Steps to implement in this repo

1. Create `frontend/` and initialize starter (TypeScript + Vite + React) or Next.js.
2. Add `services/api.ts` with retry and timeout logic. Add `hooks/useNetwork.ts` to detect connectivity.
3. Add `components/ErrorBoundary` and wrap top-level.
4. Add React Query for server-state; configure default options (retries, staleTime).
5. Implement service worker using Workbox and a small offline queue for POSTs.
6. Add Sentry configuration and include source maps in the build artifacts.
7. Add tests (unit + Playwright) and GitHub Actions pipeline.

## Quick checklist (first 7 days)

- [ ] Scaffold frontend (Vite + TS + React) at `frontend/`
- [ ] Add `services/api.ts` + error handling
- [ ] Add top-level `ErrorBoundary` and global CSS
- [ ] Add React Query and wrap app with QueryClientProvider
- [ ] Implement WebSocket wrapper with reconnect and heartbeat
- [ ] Add Workbox service worker skeleton and IndexedDB queue
- [ ] Configure Sentry and basic CI (lint, build, test)

## Final notes

- Prioritize user-critical flows (login, join session, editing) when designing fallbacks.
- Test failure modes in staging with network interruptions and delayed backend responses.
- Keep the root / public endpoints minimal in production; avoid leaking internal debug structures. Use environment-based behavior: detailed root endpoint in `development`, minimal status in `production`.

---

If you'd like, I can scaffold a Vite + React + TypeScript starter inside `frontend/` now with the suggested `services/api.ts`, `ErrorBoundary`, and a sample `package.json` and GitHub Action pipeline. Tell me which framework you prefer (React+Vite or Next.js) and whether you want SSR; I can create the scaffold and run a quick local build test.
