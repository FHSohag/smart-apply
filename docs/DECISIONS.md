# Decision 001 - Authentication

## Decision

Use Better Auth for authentication.

## Reason

- Secure
- Supports Prisma
- Easy Google OAuth integration later
- Production-ready
- Less custom authentication code

## Status

Accepted

## Decision 002 – Use Prisma 6

### Status

Accepted

### Context

Prisma 7 introduced breaking changes to the generated client and initialization flow. During integration with Better Auth, these changes caused compatibility issues.

### Decision

Use Prisma 6.19 for SmartApply.

### Rationale

Prioritize ecosystem stability and compatibility with Better Auth over adopting the latest major version.

## Decision 003 – Use shadcn/ui

### Status

Accepted

### Context

The project requires a reusable, accessible, and professional UI component library.

### Decision

Use shadcn/ui as the primary component system.

### Rationale

- Excellent Next.js integration
- Accessible components
- Highly customizable
- Industry adoption
- Suitable for production SaaS applications
