// Since the backend already handles authentication via FastAPI,
// we'll create a proxy route that forwards requests to the backend
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract the path parts to determine the auth action
  const { pathname } = request.nextUrl;
  const pathParts = pathname.split('/');
  const action = pathParts[pathParts.length - 1]; // Gets the last part of the path

  if (action === 'me') {
    // Forward the request to the backend's /api/auth/me endpoint
    const token = request.headers.get('authorization');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  // Extract the path parts to determine the auth action
  const { pathname } = request.nextUrl;
  const pathParts = pathname.split('/');
  const action = pathParts[pathParts.length - 1]; // Gets the last part of the path

  // Get the request body
  const body = await request.text();

  try {
    let backendUrl = '';
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Determine which backend endpoint to call based on the action
    if (action === 'login') {
      backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/auth/login`;
    } else if (action === 'register') {
      backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/auth/register`;
    } else if (action === 'logout') {
      backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/auth/logout`;
    } else {
      return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process auth request' }, { status: 500 });
  }
}