import { NextResponse } from 'next/server';
import AuthService from '@/app/servises/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    

    // Check for undefined values
    if (!name || !email || !password || !role) {
      console.error('Missing required fields:', { name, email, password, role });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await AuthService.signup(name, email, password, role);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message, user: result.user },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during vendor registration:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
