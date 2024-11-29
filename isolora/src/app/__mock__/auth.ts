// src/app/__mock__/auth.ts

const AuthService = {
    // Mock for signup method
    signup: jest.fn((name: string, email: string, password: string, role: string) => {
      if (!name || !email || !password || !role) {
        return Promise.resolve({
          success: false,
          message: "Missing required fields",
        });
      }
      if (email === "duplicate@example.com") {
        return Promise.resolve({
          success: false,
          message: "User already exists",
        });
      }
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
    login: jest.fn((email: string, password: string) => {
      if (!email || !password) {
        return Promise.resolve({
          success: false,
          message: "Email and password are required",
        });
      }
      if (email === "nonexistent@example.com") {
        return Promise.resolve({
          success: false,
          message: "User not found",
        });
      }
      if (email === "johndoe@example.com" && password !== "correctpassword") {
        return Promise.resolve({
          success: false,
          message: "Incorrect password",
        });
      }
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
    }),
  };
  
  export default AuthService;  