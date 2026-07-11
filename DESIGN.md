# Calculus Solver design system

## Direction

Calculus Solver is a calm, trustworthy mathematical learning workspace. The interface combines a white and pale-blue canvas, navy typography, a single bright-blue action color, and the permanent purple integral logo.

## Brand

- The shared `BrandLogo` component is the only approved logo implementation.
- The mark is a purple rounded square with a white integral symbol.
- The wordmark is `Calculus Solver` in bold Roboto.
- Footer usage may switch the wordmark to white; the mark itself does not change.

## Tokens

- Canvas: `#ffffff`; page wash: `#f6f9fe`; soft surface: `#fbfdff`.
- Navy ink: `#071f4a`; body ink: `#5f6f8d`; border: `#d9e4f3`.
- Primary action: `#0967ed`; hover: `#0757c9`.
- Success: green; warning: amber; error: red. Never communicate status by color alone.
- Roboto is used for interface and headings. Roboto Mono is reserved for mathematical input and technical values.

## Layout and components

- Desktop content width is `1240px`; long reading content stays below `760px`.
- Major tools use white panels with subtle blue borders, restrained shadows, and 12–16px radii.
- Section spacing follows an 8px scale. Related content stays close; major sections use 40–64px separation.
- All pages use `SiteHeader`, `BrandLogo`, and the shared deep-navy `Footer`.
- Touch targets are at least 44px. Mobile text is at least 14px, with 16px preferred for body copy.

## Voice

- State exactly which operations are supported.
- Never claim an answer is verified unless an independent check succeeded.
- Use direct labels: `Calculate`, `Submit Answer`, `Show explanation`.
- Avoid generic marketing claims and repeated filler FAQ answers.

## Accessibility and motion

- Preserve visible focus states and semantic headings.
- Support keyboard-only solving and `prefers-reduced-motion`.
- Avoid horizontal formula overflow; long math must scroll within its own container.
