import { POST as signupHandler } from '../api/user/add-user/route';
import AuthService from '@/app/__mock__/auth';

jest.mock('@/app/servises/auth', () => ({
    default: jest.requireActual('@/app/__mock__/auth').default,
  }));

describe('/api/user/add-user (Signup API Route)', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data between tests
  });

  it('returns 201 on successful user registration', async () => {
    const mockRequest = new Request('http://localhost/api/user/add-user', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'customer',
      }),
    });

    const response = await signupHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(201);
    expect(jsonResponse).toEqual({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'customer',
      },
    });
  });

  it('returns 400 for missing required fields', async () => {
    const mockRequest = new Request('http://localhost/api/user/add-user', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: '',
        password: 'password123',
        role: 'customer',
      }), // Missing fields
    });

    const response = await signupHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({
      success: false,
      message: 'Missing required fields',
    });
  });

  it('returns 400 for duplicate email', async () => {
    const mockRequest = new Request('http://localhost/api/user/add-user', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'duplicate@example.com', // Duplicate email
        password: 'password123',
        role: 'customer',
      }),
    });

    const response = await signupHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({
      success: false,
      message: 'User already exists',
    });
  });

  it('returns 500 for internal server error', async () => {
    // Simulate a server error
    (AuthService.signup as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const mockRequest = new Request('http://localhost/api/user/add-user', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'customer',
      }),
    });

    const response = await signupHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      success: false,
      message: 'Internal server error',
    });
  });

  it('ensures the AuthService.signup function is called with correct arguments', async () => {
    const mockRequest = new Request('http://localhost/api/user/add-user', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'customer',
      }),
    });

    await signupHandler(mockRequest);

    expect(AuthService.signup).toHaveBeenCalledWith('John Doe', 'johndoe@example.com', 'password123', 'customer');
  });
});