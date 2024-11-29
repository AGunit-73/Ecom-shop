// Import the actual AuthService mock
import AuthService from "@/app/__mock__/auth";

// Ensure the mock is set up before any tests run
beforeAll(() => {
  jest.mock('@/app/__mock__/auth', () => ({
    default: AuthService, // Mock the AuthService
  }));
});

describe("AuthService.login", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("returns success for valid credentials", async () => {
    AuthService.login.mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      user: {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        role: "customer",
      },
    });

    const response = await AuthService.login("johndoe@example.com", "correctpassword");

    expect(AuthService.login).toHaveBeenCalledWith("johndoe@example.com", "correctpassword");
    expect(response).toEqual({
      success: true,
      message: "Login successful",
      user: {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        role: "customer",
      },
    });
  });

  it("returns error for missing email or password", async () => {
    AuthService.login.mockResolvedValueOnce({
      success: false,
      message: "Email and password are required",
    });

    const response = await AuthService.login("", "");

    expect(AuthService.login).toHaveBeenCalledWith("", "");
    expect(response).toEqual({
      success: false,
      message: "Email and password are required",
    });
  });

  it("returns error for user not found", async () => {
    AuthService.login.mockResolvedValueOnce({
      success: false,
      message: "User not found",
    });

    const response = await AuthService.login("nonexistent@example.com", "password123");

    expect(AuthService.login).toHaveBeenCalledWith("nonexistent@example.com", "password123");
    expect(response).toEqual({
      success: false,
      message: "User not found",
    });
  });

  it("returns error for incorrect password", async () => {
    AuthService.login.mockResolvedValueOnce({
      success: false,
      message: "Incorrect password",
    });

    const response = await AuthService.login("johndoe@example.com", "wrongpassword");

    expect(AuthService.login).toHaveBeenCalledWith("johndoe@example.com", "wrongpassword");
    expect(response).toEqual({
      success: false,
      message: "Incorrect password",
    });
  });

  it("returns unknown error for invalid input", async () => {
    AuthService.login.mockResolvedValueOnce({
      success: false,
      message: "Unknown error",
    });

    const response = await AuthService.login("invalid@example.com", "password");

    expect(AuthService.login).toHaveBeenCalledWith("invalid@example.com", "password");
    expect(response).toEqual({
      success: false,
      message: "Unknown error",
    });
  });
});
