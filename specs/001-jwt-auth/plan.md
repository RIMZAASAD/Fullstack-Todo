# JWT Authentication Implementation Plan

## 1. Architecture Overview

The JWT authentication system will include:
- JWT token verification middleware
- User context extraction from tokens
- Integration with existing task endpoints
- Environment variable configuration for secrets

## 2. Required Components

1. **JWT Utility Module** - Handle token creation, verification, and claims extraction
2. **Authentication Middleware** - Verify tokens on protected routes
3. **Dependency Injection** - Provide current user context to route handlers
4. **Configuration** - Environment variables and settings

## 3. Implementation Steps

**Phase 1: JWT Utilities**
- Create JWT utility functions for encoding/decoding tokens
- Implement token validation with expiration checks
- Add proper secret handling using BETTER_AUTH_SECRET

**Phase 2: Authentication Middleware**
- Create FastAPI dependency for JWT verification
- Extract user_id from token claims
- Return HTTP 401 for invalid tokens

**Phase 3: API Integration**
- Update existing task endpoints to use JWT-based user context
- Remove reliance on path-based user_id where appropriate
- Maintain user data isolation

**Phase 4: Testing and Validation**
- Add unit tests for JWT utilities
- Test authentication middleware
- Verify user data isolation still works

## 4. File Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py          # JWT utilities and verification
│   │   └── middleware.py   # Authentication middleware
│   ├── dependencies.py     # Updated with auth dependencies
│   ├── main.py             # Updated to include auth
│   └── api/
│       └── tasks.py        # Updated to use JWT auth
```

## 5. Security Considerations

- Use strong secret keys (BETTER_AUTH_SECRET environment variable)
- Implement proper token expiration
- Validate token signatures
- Secure token transmission (always over HTTPS in production)

## 6. Migration Strategy

- Maintain backward compatibility during transition
- Gradually migrate endpoints to use JWT instead of path-based user_id
- Provide clear error messages for authentication failures

## Detailed Implementation Plan

### Step 1: Add Required Dependencies

Add JWT-related packages to requirements.txt:
- `python-jose[cryptography]` for JWT handling
- Update existing requirements as needed

### Step 2: Create JWT Utility Module

Create `backend/src/auth/jwt.py`:
- `create_access_token(data: dict, expires_delta: timedelta = None)` function
- `verify_token(token: str)` function that validates signature and expiration
- `decode_token_payload(token: str)` function to extract user information
- Proper error handling for invalid tokens

### Step 3: Create Authentication Middleware

Create `backend/src/auth/middleware.py`:
- `get_current_user(token: str = Security(get_token))` dependency
- `get_token(authorization: str = Header(default=None))` to extract token from headers
- Proper exception handling with 401 status codes

### Step 4: Update Dependencies Module

Update `backend/src/dependencies.py`:
- Add JWT-related dependency functions
- Update database session handling if needed for user lookup

### Step 5: Update API Routes

Update `backend/src/api/tasks.py`:
- Replace path-based user_id with JWT-extracted user_id
- Add authentication dependencies to all routes
- Update route signatures and implementations

### Step 6: Update Main Application

Update `backend/src/main.py`:
- Import and configure authentication
- Add security schemes for OpenAPI documentation

### Step 7: Testing

- Create unit tests for JWT utilities
- Test authentication middleware with valid/invalid tokens
- Verify user data isolation still works correctly
- Test error scenarios (expired tokens, invalid signatures)

### 8. Configuration

- Update documentation to reflect JWT usage
- Add environment variable documentation for BETTER_AUTH_SECRET
- Provide example token format and claims structure