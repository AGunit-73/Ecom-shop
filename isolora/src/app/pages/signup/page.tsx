"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/usercontext";
import { FaSpinner, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa";
import Image from "next/image";

export default function AuthForm() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [userRole, setUserRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to hide the header manually
  useEffect(() => {
    const header = document.querySelector("header"); // Find the header element
    if (header) {
      header.style.display = "none"; // Hide the header
    }

    // Cleanup: Restore the header when leaving this page
    return () => {
      if (header) {
        header.style.display = "block"; // Restore the header
      }
    };
  }, []);

  // Form Validation
  const validateForm = () => {
    if (!email || !password) return "Email and password are required.";
    if (!isLogin && !signupName) return "Name is required for signup.";
    return "";
  };

  // Login Handler
  const handleLogin = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("activeUser", JSON.stringify(data.user));
        setUser(data.user);
        router.push("/");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // Signup Handler
  const handleSignup = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email,
          password,
          role: userRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLogin(true);
        setError("Account created successfully! Please log in.");
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch {
      setError("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/signup.jpg')" }}
    >
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-lg w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logooo.jpg"
            alt="Isolora Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4" role="alert">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5"
          autoComplete="off"
        >
          {/* Name Field for Signup */}
          {!isLogin && (
            <div className="relative">
              <FaUserPlus className="absolute left-4 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="pl-12 p-3 border border-gray-300 rounded-lg w-full bg-white text-black focus:ring focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Role Selector for Signup */}
          {!isLogin && (
            <div className="relative">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg w-full bg-white text-black focus:ring focus:ring-indigo-500"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 p-3 border border-gray-300 rounded-lg w-full bg-white text-black focus:ring focus:ring-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute left-4 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 p-3 border border-gray-300 rounded-lg w-full bg-white text-black focus:ring focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={isLogin ? handleLogin : handleSignup}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : isLogin ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Toggle Between Login and Signup */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

