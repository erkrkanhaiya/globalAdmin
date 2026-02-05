# Admin UI (React + Vite + TypeScript)

A clean admin dashboard with auth, protected routes, layout (sidebar + topbar), dashboard, users CRUD (mock), and settings.

## Tech
- React 18 + TypeScript + Vite
- react-router-dom
- Zustand (auth)
- axios
- zod

## Getting started

```bash
# install deps
npm install
# dev
npm run dev
# build
npm run build
# preview
npm run preview
```

Open http://localhost:5173

## Test credentials
- admin@example.com / admin123
- manager@example.com / manager123

## Structure
```
src/
  api/
  components/
  pages/
  routes/
  store/
  styles/
  App.tsx
  main.tsx
```

## Notes
- API calls are mocked in-memory in `src/api`.
- Auth token and user are stored in localStorage keys: `admin_token_v1`, `admin_user_v1`.
