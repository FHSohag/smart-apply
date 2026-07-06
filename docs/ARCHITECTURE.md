# SmartApply Architecture

## Overview

SmartApply is an AI-assisted job recommendation platform that helps users discover jobs based on their CVs. The system analyzes resumes, understands user skills, and recommends relevant job opportunities using AI.

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Backend

- Next.js Route Handlers
- Better Auth

## Database

- PostgreSQL (Neon)
- Prisma ORM

## Validation

- Zod
- React Hook Form

---

# High-Level Architecture

---

# Current Modules

## Authentication

Status: ✅ In Progress

Responsibilities

- User registration
- User login
- Session management

Technology

- Better Auth
- Prisma
- PostgreSQL

---

## Resume Module

Status: 🚧 Planned

Responsibilities

- Upload resume
- Store resume
- Parse resume
- Extract skills

---

## AI Recommendation Engine

Status: 🚧 Planned

Responsibilities

- Analyze resume
- Analyze job descriptions
- Match skills
- Generate recommendations

---

## Dashboard

Status: 🚧 Planned

Responsibilities

- User profile
- Resume management
- Saved jobs
- Recommended jobs

---

# Project Layers

Presentation Layer

- Pages
- Components

Application Layer

- Route Handlers
- Business Logic

Data Layer

- Prisma

Storage Layer

- PostgreSQL

---

# Design Principles

- Modular architecture
- Reusable components
- Type safety
- Validation-first
- Mobile-first UI
- Production-ready code
- Feature-based organization

---

# Future Architecture

Planned integrations

- Google OAuth
- Resume Parser
- OpenAI
- Vector Search
- Background Jobs
- Email Notifications
