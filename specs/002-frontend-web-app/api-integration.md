# API Integration Specification: Frontend Web Application

## API Configuration

### Base URL
- Development: `http://localhost:8000` (or configured via environment variable)
- Production: Configured via environment variable
- Environment variables: `NEXT_PUBLIC_API_BASE_URL`

### Authentication Headers
- Header: `Authorization: Bearer <jwt-token>`
- Applied to all authenticated requests
- Token retrieved from Better Auth session or secure storage

## Authentication API Flow

### Signup Process
1. User submits signup form data
2. Send POST request to Better Auth signup endpoint
3. Receive JWT token upon successful signup
4. Store token securely
5. Redirect to dashboard

### Login Process
1. User submits login form data
2. Send POST request to Better Auth login endpoint
3. Receive JWT token upon successful login
4. Store token securely
5. Redirect to dashboard

### Logout Process
1. Clear stored JWT token
2. Redirect to login page
3. Optionally notify backend to invalidate token

## Task API Operations

### Get All Tasks
- **Method**: GET
- **Endpoint**: `/api/tasks`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**: Array of task objects
- **Success Status**: 200 OK
- **Error Handling**:
  - 401: Redirect to login
  - 500: Show error message

### Create Task
- **Method**: POST
- **Endpoint**: `/api/tasks`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "completed": false
}
```
- **Response**: Created task object
- **Success Status**: 201 Created
- **Error Handling**:
  - 401: Redirect to login
  - 422: Validation error
  - 500: Show error message

### Get Specific Task
- **Method**: GET
- **Endpoint**: `/api/tasks/{taskId}`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**: Single task object
- **Success Status**: 200 OK
- **Error Handling**:
  - 401: Redirect to login
  - 404: Task not found
  - 500: Show error message

### Update Task
- **Method**: PUT
- **Endpoint**: `/api/tasks/{taskId}`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "completed": false
}
```
- **Response**: Updated task object
- **Success Status**: 200 OK
- **Error Handling**:
  - 401: Redirect to login
  - 404: Task not found
  - 422: Validation error
  - 500: Show error message

### Toggle Task Completion
- **Method**: PATCH
- **Endpoint**: `/api/tasks/{taskId}/complete`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**: Updated task object
- **Success Status**: 200 OK
- **Error Handling**:
  - 401: Redirect to login
  - 404: Task not found
  - 500: Show error message

### Delete Task
- **Method**: DELETE
- **Endpoint**: `/api/tasks/{taskId}`
- **Headers**:
  - `Authorization: Bearer <jwt-token>`
- **Response**: No content
- **Success Status**: 204 No Content
- **Error Handling**:
  - 401: Redirect to login
  - 404: Task not found
  - 500: Show error message

## API Service Layer

### ApiClient Class/Module
- Centralized API service with common configuration
- Automatic JWT token attachment
- Error handling and retry logic
- Request/response interceptors

### Authentication Service
- Methods for login, signup, logout
- Token storage and retrieval
- Session management
- Token refresh logic

### Task Service
- All task-related API calls
- Data transformation if needed
- Error handling specific to task operations

## Error Handling Strategy

### Client-Side Error Types
- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: 401 Unauthorized
- **Validation Errors**: 422 Unprocessable Entity
- **Server Errors**: 5xx status codes
- **Client Errors**: 4xx status codes (other than 401)

### Error Response Format
```json
{
  "detail": "Error message",
  "status_code": 404
}
```

### Error Handling Actions
- **401**: Redirect to login page
- **404**: Show "not found" message
- **422**: Show validation error messages
- **500**: Show generic error message
- **Network**: Show connection error message

## Loading States

### API Request States
- **Idle**: Initial state
- **Loading**: During API request
- **Success**: After successful response
- **Error**: After failed request

### Loading Indicators
- Global loading spinner for page transitions
- Inline loading indicators for specific actions
- Skeleton screens during initial data load
- Progress indicators for long-running operations

## Caching Strategy

### Client-Side Caching
- Cache user's task list after initial load
- Invalidate cache on mutations (create/update/delete)
- Use optimistic updates for better UX
- Implement cache expiration if needed

### Cache Keys
- `tasks-${userId}`: User's task list
- `task-${taskId}-${userId}`: Individual task
- `user-session`: User authentication status

## Retry Logic

### Retry Conditions
- Network timeout errors
- Server 5xx errors
- Rate limiting responses (429)

### Retry Configuration
- Maximum 3 retry attempts
- Exponential backoff (1s, 2s, 4s)
- Immediate retry for optimistic updates

## Environment Configuration

### Development
- API URL: `http://localhost:8000`
- Logging: Detailed request/response logging
- Error handling: Verbose error messages

### Production
- API URL: Configured via environment variable
- Logging: Minimal or no request logging
- Error handling: Generic error messages for security

## Security Considerations

### Token Security
- Store tokens in secure, httpOnly cookies if possible
- If storing in memory, clear on tab/window close
- Never log tokens in console or network logs
- Implement automatic token refresh

### Request Security
- Use HTTPS for all API communications
- Validate all responses before processing
- Sanitize all inputs before sending to API
- Implement CSRF protection where needed

## Performance Optimization

### Request Optimization
- Batch multiple operations when possible
- Implement request deduplication
- Use compression for large payloads
- Optimize image/file uploads

### Response Processing
- Implement efficient data parsing
- Use streaming for large datasets
- Lazy load non-critical data
- Preload critical resources