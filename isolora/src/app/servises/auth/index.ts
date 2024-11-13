import { sql } from "@vercel/postgres";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Environment variables for encryption
const encryptionKey = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : undefined;
const iv = process.env.ENCRYPTION_IV
  ? Buffer.from(process.env.ENCRYPTION_IV, "hex")
  : undefined;

if (!encryptionKey || !iv) {
  console.error("Encryption key or IV is not defined. Please set ENCRYPTION_KEY and ENCRYPTION_IV environment variables.");
}

// Encrypt email function using AES-256-CBC
function encryptEmail(email: string): string {
  if (!encryptionKey || !iv) {
    throw new Error("Encryption key or IV is missing.");
  }
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Decrypt email function using AES-256-CBC
function decryptEmail(encryptedEmail: string): string {
  if (!encryptionKey || !iv) {
    throw new Error("Encryption key or IV is missing.");
  }
  const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
  let decrypted = decipher.update(encryptedEmail, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Define User interface
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export default class AuthService {
  // Signup function for user registration
  static async signup(
    name: string,
    email: string,
    password: string,
    role: "vendor" | "customer"
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      console.log("Encryption Key:", encryptionKey);
      console.log("IV:", iv);

      if (!name || !email || !password || !role) {
        console.error("Missing required fields:", { name, email, password, role });
        return { success: false, message: "Missing required fields" };
      }

      const encryptedEmail = encryptEmail(email);
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await sql<{ id: number; name: string; email: string; password: string; role: string }>`
        INSERT INTO users (name, emailid, password, role)
        VALUES (${name}, ${encryptedEmail}, ${hashedPassword}, ${role})
        RETURNING id, name, emailid AS email, password, role;
      `;

      const user = result.rows[0] as User;
      return {
        success: true,
        message: "User registered successfully",
        user,
      };
    } catch (error) {
      console.error("Error during user registration:", error);
      return { success: false, message: "Error registering user" };
    }
  }

  // Login function for user authentication
  static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      if (!email || !password) {
        console.error("Missing email or password");
        return { success: false, message: "Email and password are required" };
      }

      const encryptedEmail = encryptEmail(email);

      const result = await sql<{ id: number; name: string; email: string; password: string; role: string }>`
        SELECT id, name, emailid AS email, password, role
        FROM users
        WHERE emailid = ${encryptedEmail};
      `;

      if (result.rowCount === 0) {
        return { success: false, message: "User not found" };
      }

      const user = result.rows[0] as User;
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, message: "Incorrect password" };
      }

      if (user.email) {
        user.email = decryptEmail(user.email);
      } else {
        console.error("Email is undefined during decryption");
      }

      return {
        success: true,
        message: "Login successful",
        user,
      };
    } catch (error) {
      console.error("Error during user login:", error);
      return { success: false, message: "Error logging in" };
    }
  }
}
