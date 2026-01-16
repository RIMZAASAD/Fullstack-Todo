# Data Model: Backend REST API with Persistent Storage

## Task Entity

**Description**: Represents a user's task with all required attributes for the todo application

**Fields**:
- `id`: UUID (primary key) - Unique identifier for the task
- `title`: String (required, max 255 chars) - Title of the task
- `description`: String (optional, max 1000 chars) - Detailed description of the task
- `completed`: Boolean (default: false) - Completion status of the task
- `user_id`: String (required) - Identifier of the user who owns the task
- `created_at`: DateTime (auto-generated) - Timestamp when task was created
- `updated_at`: DateTime (auto-generated) - Timestamp when task was last updated

**Relationships**:
- Each Task belongs to one User (identified by user_id)
- No direct relationships between tasks

**Validation Rules**:
- `title` must not be empty or null
- `user_id` must not be empty or null
- `completed` defaults to false if not specified
- `created_at` and `updated_at` are automatically managed by the system

**State Transitions**:
- Task starts with `completed = false`
- Task can transition to `completed = true` via PATCH endpoint
- Task can transition back to `completed = false` via PATCH endpoint
- Task can be deleted, removing it from the user's list

## API Contract Summary

**Endpoints**:
- `GET /api/{user_id}/tasks` - Retrieve all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{id}` - Retrieve a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a specific task completely
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status

**Request/Response Examples**:
- Task creation request: `{"title": "Buy groceries", "description": "Milk, bread, eggs", "completed": false}`
- Task response: `{"id": "uuid", "title": "Buy groceries", "description": "Milk, bread, eggs", "completed": false, "user_id": "user123", "created_at": "timestamp", "updated_at": "timestamp"}`