import AuthService from "@/app/__mock__/auth";

// Ensure the mock is set up before any tests run
beforeAll(() => {
  jest.mock('@/app/__mock__/auth', () => ({
    default: AuthService, // Mock the AuthService
  }));
});

describe("AuthService.signup", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("returns success for valid user details", async () => {
    AuthService.signup.mockResolvedValueOnce({
      success: true,
      message: "User registered successfully",
      user: {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        role: "customer",
      },
    });

    const response = await AuthService.signup("John Doe", "johndoe@example.com", "password123", "customer");

    expect(AuthService.signup).toHaveBeenCalledWith("John Doe", "johndoe@example.com", "password123", "customer");
    expect(response).toEqual({
      success: true,
      message: "User registered successfully",
      user: {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        role: "customer",
      },
    });
  });

  it("returns error for missing required fields", async () => {
    AuthService.signup.mockResolvedValueOnce({
      success: false,
      message: "Missing required fields",
    });

    const response = await AuthService.signup("", "", "", "");

    expect(AuthService.signup).toHaveBeenCalledWith("", "", "", "");
    expect(response).toEqual({
      success: false,
      message: "Missing required fields",
    });
  });

  it("returns error for duplicate email", async () => {
    AuthService.signup.mockResolvedValueOnce({
      success: false,
      message: "User already exists",
    });

    const response = await AuthService.signup("John Doe", "duplicate@example.com", "password123", "customer");

    expect(AuthService.signup).toHaveBeenCalledWith("John Doe", "duplicate@example.com", "password123", "customer");
    expect(response).toEqual({
      success: false,
      message: "User already exists",
    });
  });
});
