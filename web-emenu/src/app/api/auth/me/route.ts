import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the session token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // For now, return mock user data
    // In a real implementation, you would validate the token and fetch user data from your database
    const mockUser = {
      id: 'user-1',
      email: 'staff@sol-emenu.vn',
      first_name: 'John',
      last_name: 'Doe',
      role: {
        id: 'role-1',
        name: 'Restaurant Staff'
      },
      permissions: ['tables:read', 'orders:read', 'orders:create', 'menu:read']
    };

    return NextResponse.json({
      success: true,
      data: mockUser
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}