# Calculus Solver

A Next.js App Router AI math solver for calculus and algebra. One smart input handles derivatives, integrals, limits, equations, simplification, factoring, expansion, and graphing.

## Features

- Single smart input with natural language, formulas, and LaTeX support.
- AI interpretation via DeepSeek (server-side only).
- Local symbolic verification with `math.js` and `nerdamer`.
- Step-by-step solutions with KaTeX rendering.
- Interactive Plotly graphs sampled in the browser.
- LocalStorage history.
- SEO metadata, sitemap, and robots.txt.
- Mobile-first responsive UI.

## Tech Stack

- Next.js 15 App Router
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui style primitives
- Lucide Icons
- KaTeX
- math.js + Nerdamer
- Plotly.js
- DeepSeek API
- Vitest + Playwright

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your DEEPSEEK_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript checks
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Playwright E2E tests

## Environment Variables

```env
DEEPSEEK_API_KEY=your_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`DEEPSEEK_API_KEY` is required for AI explanations. Without it, the app falls back to local symbolic computation.

## Project Structure

```text
calculus-solver/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components
├── data/                # Static examples and FAQs
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, schemas, API, and math logic
├── types/               # Shared TypeScript types
├── tests/               # Vitest unit tests
├── e2e/                 # Playwright E2E tests
```

## Notes

- DeepSeek API key is never exposed to the browser; all AI calls go through `app/api/solve/route.ts`.
- Verification status is generated locally and should not be treated as a formal proof.
- Graph expressions are sampled client-side with `math.js`.
