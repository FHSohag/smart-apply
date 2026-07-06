# Coding Standards

## General

- Use TypeScript for all application code.
- Prefer named exports over default exports (except for Next.js pages/layouts where required).
- Keep components focused on a single responsibility.
- Avoid files longer than 200–300 lines when possible.

## File Naming

- Components: kebab-case
  - register-form.tsx
  - job-card.tsx

- Utilities
  - auth.ts
  - prisma.ts

## Components

- Reusable UI goes in `components/ui`.
- Feature-specific components go in `components/<feature>`.

## Validation

- All Zod schemas live in `lib/validations`.

## Database

- Access Prisma only through `lib/prisma.ts`.

## Styling

- Use Tailwind CSS.
- Use shadcn/ui components whenever possible.
- Avoid custom CSS unless necessary.

## Imports

Order imports as:

1. React/Next
2. Third-party libraries
3. Internal aliases (`@/...`)

## Git

Commit after each completed feature.

Commit format:

feat:
fix:
docs:
refactor:
style:
test:
chore:

## Documentation

Update documentation whenever:

- Architecture changes
- Dependencies change
- Major features are completed
