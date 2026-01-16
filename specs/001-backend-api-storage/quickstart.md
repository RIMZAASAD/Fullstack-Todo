# Quickstart Guide: Backend REST API with Persistent Storage

## Prerequisites
- Python 3.11+
- pip package manager
- Access to Neon Serverless PostgreSQL database

## Setup

1. **Install dependencies**:
   ```bash
   pip install fastapi sqlmodel psycopg2-binary uvicorn pytest
   ```

2. **Set up environment variables**:
   ```bash
   export DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
   ```

3. **Create the project structure**:
   ```
   backend/
   ├── src/
   │   ├── models/
   │   ├── services/
   │   └── api/
   ├── tests/
   └── requirements.txt
   ```

## Initialize Database

1. **Create database tables**:
   ```python
   from backend.src.models.task import create_db_and_tables

   create_db_and_tables()
   ```

2. **Run database migrations** (if using alembic):
   ```bash
   alembic upgrade head
   ```

## Run the API

1. **Start the development server**:
   ```bash
   uvicorn backend.src.main:app --reload
   ```

2. **API will be available at**: `http://localhost:8000`

## Test the API

1. **Run unit tests**:
   ```bash
   pytest tests/unit/
   ```

2. **Run integration tests**:
   ```bash
   pytest tests/integration/
   ```

## Example API Calls

1. **Create a task**:
   ```bash
   curl -X POST http://localhost:8000/api/user123/tasks \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn FastAPI", "description": "Build a todo app"}'
   ```

2. **Get all tasks for a user**:
   ```bash
   curl http://localhost:8000/api/user123/tasks
   ```

3. **Update a task**:
   ```bash
   curl -X PUT http://localhost:8000/api/user123/tasks/task-id \
     -H "Content-Type: application/json" \
     -d '{"title": "Master FastAPI", "description": "Build a complete app", "completed": false}'
   ```

## API Endpoints

- `GET /api/{user_id}/tasks` - Get all tasks for user
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status