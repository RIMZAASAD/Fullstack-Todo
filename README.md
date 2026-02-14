# Fullstack Todo Application

A modern fullstack todo application featuring JWT-based authentication and a beautiful dark-themed UI built with Next.js and Shadcn/UI components.

## 🚀 Features

- **JWT Authentication**: Secure user registration, login, and session management
- **Dark Theme UI**: Beautiful dark-themed interface with consistent styling
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Task Management**: Create, update, complete, and manage your todos efficiently
- **Password Strength Validation**: Real-time password strength checking with visual indicators
- **Smooth Animations**: Fluid animations and transitions throughout the application
- **Secure Backend**: Password hashing, user isolation, and proper error handling
- **Modern Tech Stack**: Built with cutting-edge technologies

## 🛠️ Tech Stack

### Frontend
- **Next.js**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library
- **Shadcn/UI**: Reusable UI components

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLModel**: SQL database modeling
- **Pydantic**: Data validation and settings management
- **bcrypt**: Password hashing
- **JWT**: Token-based authentication
- **PostgreSQL**: Robust relational database

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- PostgreSQL (or Docker for containerized setup)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
# Make sure to include:
# - OPENAI_API_KEY for AI functionality
# - JWT_SECRET for authentication
# - DATABASE_URL for database connection
```

4. Start the backend server:
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### AI Chatbot Setup (Included)

The application includes an AI-powered chatbot for natural language task management. All required dependencies are included in requirements.txt.

1. The chatbot endpoints are automatically available when you start the backend server:
   - `POST /api/{user_id}/chat` - Chatbot interaction
   - `POST /api/{user_id}/voice` - Voice command processing

2. Make sure to configure your OpenAI API key in the .env file:
```
OPENAI_API_KEY=your-openai-api-key-here
```

3. The chatbot API will be available at `http://localhost:8000/api/{user_id}/chat`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
# For chatbot integration, ensure NEXT_PUBLIC_BACKEND_URL points to your backend
```

4. Start the development server:
```bash
npm run dev
```

### Running the Application

**Backend Server:**
```bash
cd backend
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Server:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:8000`

## 🔐 Authentication System

The application implements a secure JWT-based authentication system:

- **Registration**: New user account creation with password hashing and strength validation
- **Login**: Secure authentication with JWT token generation
- **Protected Routes**: Middleware to protect authenticated routes
- **User Isolation**: Each user can only access their own tasks
- **Password Strength**: Real-time validation requiring minimum 8 characters with uppercase, lowercase, number, and special character

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user (with password strength validation)
- `POST /api/auth/login` - Authenticate user and return JWT token
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

#### Task Management
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PUT /api/tasks/{id}/toggle-complete` - Toggle task completion status

## 🎨 UI Components

The application features a consistent dark-themed UI with the following components:

- **Layout**: Responsive layout with navigation sidebar
- **Authentication Forms**: Login and signup forms with validation and password strength indicators
- **Task Components**: Task list, individual task items, and task forms with animations
- **UI Elements**: Buttons, cards, dialogs, checkboxes, and tabs
- **Statistics Cards**: Visual representation of task metrics
- **Animated Elements**: Smooth animations throughout the interface

## 🤖 AI Chatbot Integration

The application includes an AI-powered chatbot for natural language task management:

- **Natural Language Processing**: Add, list, update, complete, and delete tasks using natural language
- **Multilingual Support**: Supports both English and Urdu commands
- **Voice Commands**: Speak your tasks instead of typing them
- **Conversation Context**: Maintains context during conversations for more natural interactions
- **Secure Integration**: Fully integrated with the existing authentication system

### Using the Chatbot

#### Text Commands
- "Add task: Buy groceries" - Add a new task
- "Show me my tasks" - List all your tasks
- "Complete task 1" - Mark a task as completed
- "Update task 1 to: Buy organic groceries" - Update a task description
- "Delete task 2" - Remove a task

#### Voice Commands
- Click the microphone button and speak your command
- Works with all text commands mentioned above
- Supports both English and Urdu voice input

### API Endpoints

#### Chatbot
- `POST /api/{user_id}/chat` - Interact with the AI chatbot
- `POST /api/{user_id}/voice` - Submit voice commands
- `GET /api/{user_id}/health` - Check chat API health
- `GET /api/{user_id}/voice/health` - Check voice API health

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Production Build

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 💡 Password Strength Validation

The application includes sophisticated password validation with real-time feedback:

- **Minimum 8 characters**
- **At least one uppercase letter**
- **At least one lowercase letter**
- **At least one number**
- **At least one special character**
- **Visual strength indicator** showing weak/medium/strong levels
- **Detailed breakdown** of requirements as they're met

## 🎯 Pages & Routes

- `/` - Landing page with smooth animations and feature showcase
- `/login` - Secure login with password strength validation
- `/signup` - Registration with real-time password strength feedback
- `/dashboard` - Main task management dashboard
- `/tasks` - Dedicated task management page
- `/settings` - User account settings
- `/notifications` - Notification center
- `/forgot-password` - Password recovery flow
- `/reset-password` - Password reset form

## 🌟 Key Enhancements

1. **Smooth Animations**: Framer Motion-powered animations throughout the UI
2. **Password Strength**: Real-time validation with visual feedback
3. **Responsive Design**: Fully responsive layout for all device sizes
4. **Dark Theme**: Consistent dark-themed UI with proper contrast
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Performance**: Optimized loading and rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues

If you encounter any issues, please open an issue in the repository with detailed information about the problem and steps to reproduce.

## 👥 Authors

- **Developer**: Fullstack Todo Application Team

---

Made with ❤️ using Next.js, FastAPI, and Shadcn/UI

Made by Rimza