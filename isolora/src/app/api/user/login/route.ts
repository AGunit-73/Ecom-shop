
import { NextResponse } from 'next/server';
import AuthService from '@/app/servises/auth';

// Define activeUser as a global or higher-scope variable if you need to access it outside this function
let activeUser: {
  id: number;
  name: string;
  email: string;
  role: string;
} | null = null;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await AuthService.login(email, password);

    if (result.success && result.user) {
      // Store the active user details in the activeUser object
      activeUser = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      };

      return NextResponse.json(
        { success: true, message: result.message, user: activeUser },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
