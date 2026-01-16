# Todo Frontend Application

A responsive Todo application with authentication and task management features.

## Features

- User authentication (login/signup)
- Task management (create, read, update, delete)
- Toggle task completion status
- Responsive design for mobile and desktop
- Secure JWT-based authentication

## Tech Stack

- Next.js 16+ with App Router
- React 19+
- TypeScript
- Tailwind CSS for styling
- Better Auth for authentication
- Axios for API requests
- Lucide React for icons

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root of the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - The base URL of the backend API (defaults to http://localhost:8000)

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run the linter

## Project Structure

```
frontend/
├── app/                 # Next.js app router pages
│   ├── (auth)/          # Authentication pages (login, signup)
│   ├── dashboard/       # Protected dashboard page
│   ├── globals.css      # Global styles
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
│   ├── auth/            # Authentication-related components
│   ├── layout/          # Layout components
│   ├── task/            # Task management components
│   └── ui/              # Basic UI components
├── lib/                 # Libraries and utilities
│   ├── api/             # API client and services
│   ├── auth/            # Authentication utilities
│   └── utils/           # General utilities
├── context/             # React context providers
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## API Integration

The application connects to a backend API that provides JWT-authenticated endpoints for user authentication and task management. The API client automatically attaches the JWT token to all authenticated requests.

## Security

- JWT tokens are stored securely in localStorage
- All API requests include proper authentication headers
- Protected routes prevent unauthorized access
- Form inputs are validated before submission
