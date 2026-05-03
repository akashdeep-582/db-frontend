# Frontend Architecture

## Layer Structure

Every feature follows this strict top-down dependency chain. A layer may only import from layers below it — never from the same level or above.

```
Page/View  (JSX only)
    ↓
Custom Hook  (state + logic)
    ↓
Service  (API calls + mappers)
    ↓
Utils  (pure functions — validators, formatters)
    ↓
Types  (contracts)
    ↓
Constants  (static data)
```

---

## Layers in Detail

### Page / View
- **Only JSX.** No `useState`, no `useQuery`, no `axios`, no business logic.
- Imports exactly **one custom hook** per page that provides everything the view needs.
- Passes data and callbacks down to child components as props.
- Child components defined in the same file are fine if they are only used on that page.

```tsx
// ✅ Good
export default function MyListings() {
  const { properties, isLoading, handleDelete } = useMyListings()
  return (...)
}

// ❌ Bad — logic in the view
export default function MyListings() {
  const [items, setItems] = useState([])
  async function handleDelete(id) { await api.delete(...) }
  return (...)
}
```

---

### Custom Hook
- Owns all **state, side effects, and orchestration** for a page or feature.
- Composes React Query (`useQuery`, `useMutation`), `useState`, `useNavigate`, etc.
- Calls service functions — never `axios` directly.
- Returns a flat object of data + callbacks for the view to consume.
- Confirmation dialogs (`confirm()`) and navigation decisions live here, not in the view.

```ts
// ✅ Good
export function useMyListings() {
  const deleteMutation = useMutation({ mutationFn: deleteProperty })

  function handleDelete(id: string, title: string) {
    if (confirm(`Delete "${title}"?`)) deleteMutation.mutate(id)
  }

  return { properties, isLoading, handleDelete }
}
```

---

### Service
- **Only API calls and response mapping.** No state, no React.
- Each function maps the raw DTO shape to the frontend type via a mapper function.
- Name pattern: `verbNoun` — `listMyProperties`, `createProperty`, `deleteProperty`.

```ts
// ✅ Good
export async function listMyProperties(): Promise<Property[]> {
  const { data } = await api.get<ListMyPropertiesResponseDTO>('/api/properties/my')
  return data.properties ?? []
}

// ❌ Bad — mapping skipped, raw DTO leaks into the app
export async function listMyProperties() {
  const { data } = await api.get('/api/properties/my')
  return data
}
```

---

### Utils
- **Pure functions only.** Same input always produces same output. No side effects.
- Split by concern — one file per domain: `validators/postProperty.ts`, `errors.ts`, `formatters.ts`.

```ts
// ✅ Good
export function validatePostPropertyForm(f: PostPropertyFormFields): PostPropertyFormErrors

export function getApiError(error: unknown, fallback = 'Something went wrong'): string
```

---

### Types
- TypeScript interfaces and type aliases only. No logic, no imports from other layers.
- `PostPropertyFormFields` — frontend form shape (camelCase)
- `CreatePropertyPayload` — API request shape (snake_case)
- `Property` — API response shape

> **Rule:** Frontend state is always camelCase. API payloads are always snake_case. The service mapper bridges the two.

---

### Constants
- Static arrays and lookup objects used across the feature.
- No functions, no imports from other layers.

```ts
export const PROPERTY_TYPE_OPTIONS: ToggleOption[] = [
  { value: '1BHK', label: '1 BHK' },
  ...
]
```

---

## CSS Strategy

All styling uses global utility classes from `@dropbroker/ui`.

- **No inline styles** — if a class doesn't exist, add it to `ui/src/ui.css`.
- **No CSS Modules in remotes** — Module Federation doesn't reliably load them in dev mode.
- Page-specific layout classes go in `ui.css` with a descriptive name (`ui-page-lg`, `ui-page-header`, `ui-empty-state`).

---

## File Naming

```
src/
  pages/         MyListings.tsx
  hooks/         useMyListings.ts
  services/      property.service.ts
  utils/
    validators/  postProperty.ts
    errors.ts
  types/         property.ts
  constants/     property.ts
```

---

## Module Federation Remotes

Each remote (`owner-app`, `admin-app`) must be **built and served via `vite preview`** before the shell can load it.

```bash
npm run build && npx vite preview --port <PORT>
```

The shell (`localhost:3000`) proxies all `/api/*` requests to the AWS API Gateway. Remotes use `baseURL: ''` so they inherit the shell's origin and proxy automatically.
