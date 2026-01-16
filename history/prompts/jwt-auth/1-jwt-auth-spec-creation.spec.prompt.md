---
id: 1
title: jwt-auth-spec-creation
stage: spec
date: 2026-01-13
surface: agent
model: Claude Sonnet 4.5
feature: jwt-auth
branch: 001-jwt-auth
user: user
command: /sp.specify
labels: ["authentication", "jwt", "security", "api", "specification"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-jwt-auth/spec.md
  - specs/001-jwt-auth/checklists/requirements.md
tests: []
outcome: Specification created successfully for JWT authentication feature
evaluation: The specification covers all required aspects of JWT authentication for the backend API
---

# Prompt History Record

## Command
/sp.specify

## Prompt Text
```
/sp.specify

Project: Evolution of Todo – Phase II (Spec 2)
Feature: Authentication & Secure API Access

Target audience:
Claude Code (acting as Security Engineer + Backend Integrator)

Objective:
Secure all backend API endpoints using JWT authentication issued by Better Auth on the frontend.

Scope:
This specification covers authentication, JWT verification, and user isolation.
Frontend UI details are out of scope.

Authentication Flow:
1. User signs in via Next.js frontend using Better Auth
2. Better Auth issues a JWT token
3. Frontend attaches JWT in Authorization header
4. FastAPI verifies JWT using shared secret
5. Backend extracts authenticated user ID
6. Backend enforces user isolation

JWT Requirements:
- Header: Authorization: Bearer <token>
- Algorithm: As supported by Better Auth
- Secret key: BETTER_AUTH_SECRET (env variable)
- Token expiry enforced

Backend Security Rules:
- All endpoints require valid JWT
- Requests without token → 401 Unauthorized
- user_id in URL must match user_id in JWT
- Users may only access their own tasks

Required Backend Changes:
- JWT verification middleware
- Token decoding and validation
- User context extraction
- Query filtering by authenticated user

Technology Constraints:
- Backend: FastAPI
- Auth issuer: Better Auth (Next.js)
- Token type: JWT
- Shared secret via environment variable

Constraints:
- No manual code writing
- JWT logic must be reusable
- No database session sharing
- Stateless backend authentication

Not building:
- Frontend login UI
- Password reset flows
- Role-based permissions
- OAuth providers

Completion checklist:
- JWT verification middleware exists
- Invalid tokens rejected
- Valid tokens grant access
- User data isolation enforced
- Backend works independently of frontend sessions
```

## Response Text
Created feature specification for JWT authentication in specs/001-jwt-auth/spec.md with comprehensive requirements covering JWT verification, user isolation, and security measures. Also created validation checklist at specs/001-jwt-auth/checklists/requirements.md.