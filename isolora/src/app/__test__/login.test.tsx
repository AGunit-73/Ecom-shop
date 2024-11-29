import { POST as loginHandler } from '../api/user/login/route';
import AuthService from '@/app/__mock__/auth';

jest.mock('@/app/servises/auth', () => ({
    default: jest.requireActual('@/app/__mock__/auth').default,
  }));

describe('/api/user/login (Login API Route)', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data between tests
  });

  it('returns 201 on successful login with user details', async () => {
    const mockRequest = new Request('http://localhost/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'johndoe@example.com',
        password: 'correctpassword',
      }),
    });

    const response = await loginHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(201);
    expect(jsonResponse).toEqual({
      success: true,
      message: 'Login successful',
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'customer',
      },
    });
  });

  it('returns 400 for missing email or password', async () => {
    const mockRequest = new Request('http://localhost/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        email: '',
        password: '',
      }), // Missing email and password
    });

    const response = await loginHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({
      success: false,
      message: 'Email and password are required',
    });
  });

  it('returns 400 for invalid credentials', async () => {
    const mockRequest = new Request('http://localhost/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'johndoe@example.com',
        password: 'wrongpassword', // Incorrect password
      }),
    });

    const response = await loginHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({
      success: false,
      message: 'Incorrect password',
    });
  });

  it('returns 500 for internal server error', async () => {
    // Simulate a server error
    (AuthService.login as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const mockRequest = new Request('http://localhost/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'johndoe@example.com',
        password: 'correctpassword',
      }),
    });

    const response = await loginHandler(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      success: false,
      message: 'Internal server error',
    });
  });

  it('ensures the AuthService.login function is called with correct arguments', async () => {
    const mockRequest = new Request('http://localhost/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'johndoe@example.com',
        password: 'correctpassword',
      }),
    });

    await loginHandler(mockRequest);

    expect(AuthService.login).toHaveBeenCalledWith('johndoe@example.com', 'correctpassword');
  });
});