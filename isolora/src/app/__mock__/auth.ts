// src/app/__mock__/auth.ts

const AuthService = {
  // Mock for signup method
  signup: jest.fn().mockImplementation((name: string, email: string, password: string, role: string) => {
    // Simulate missing required fields
    if (!name || !email || !password || !role) {
      return Promise.resolve({
        success: false,
        message: "Missing required fields",
      });
    }

    // Simulate duplicate email error
    if (email === "duplicate@example.com") {
      return Promise.resolve({
        success: false,
        message: "User already exists",
      });
    }

    // Simulate successful user registration
    return Promise.resolve({
      success: true,
      message: "User registered successfully",
      user: {
        id: 1,
        name,
        email,
        role,
      },
    });
  }),

  // Mock for login method
  login: jest.fn().mockImplementation((email: string, password: string) => {
    // Simulate missing email or password
    if (!email || !password) {
      return Promise.resolve({
        success: false,
        message: "Email and password are required",
      });
    }

    // Simulate user not found
    if (email === "nonexistent@example.com") {
      return Promise.resolve({
        success: false,
        message: "User not found",
      });
    }

    // Simulate incorrect password
    if (email === "johndoe@example.com" && password !== "correctpassword") {
      return Promise.resolve({
        success: false,
        message: "Incorrect password",
      });
    }

    // Simulate successful login
    if (email === "johndoe@example.com" && password === "correctpassword") {
      return Promise.resolve({
        success: true,
        message: "Login successful",
        user: {
          id: 1,
          name: "John Doe",
          email,
          role: "customer",
        },
      });
    }

    // Default error simulation
    return Promise.resolve({
      success: false,
      message: "Unknown error",
    });
  }),
};

export default AuthService;
