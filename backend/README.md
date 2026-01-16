# Task Management API

This is a REST API for managing user tasks with persistent storage.

## Features

- Create, read, update, and delete tasks
- User isolation - each user has their own tasks
- Toggle task completion status
- Health check endpoint

## Endpoints

### Authentication

All endpoints require JWT authentication. The user ID is extracted from the JWT token rather than passed as a path parameter. Users must provide a valid JWT token in the Authorization header.

### Authorization Header Format

```
Authorization: Bearer <jwt-token-here>
```

The JWT token must be signed with the BETTER_AUTH_SECRET and contain a `user_id` claim.

### Base URL

```
/api
```

### Tasks Endpoints

#### Create Task
```
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "user_id": "user123",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

#### Get All Tasks
```
GET /api/tasks
```

**Response:**
```json
[
  {
    "id": "uuid-string",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "user_id": "user123",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
]
```

#### Get Specific Task
```
GET /api/tasks/{task_id}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "user_id": "user123",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

#### Update Task
```
PUT /api/tasks/{task_id}
```

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "user_id": "user123",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

#### Toggle Task Completion
```
PATCH /api/tasks/{task_id}/complete
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": true,
  "user_id": "user123",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

#### Delete Task
```
DELETE /api/tasks/{task_id}
```

**Response:** Status code 204

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy"
}
```

## Database

The API uses PostgreSQL with SQLAlchemy ORM. The database connection string can be configured via the `DATABASE_URL` environment variable.

## Running the API

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the API:
```bash
uvicorn src.main:app --reload
```

## Testing

Run the tests:
```bash
python -m pytest
```