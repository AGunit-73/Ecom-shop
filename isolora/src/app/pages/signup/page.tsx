"use client" 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/usercontext";
import { FaSpinner, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa";

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

  const validateForm = () => {
    if (!email || !password) return "Email and password are required";
    if (!isLogin && !signupName) return "Name is required for signup";
    return "";
  };

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
        setError(data.message || "Login failed");
      }
    } catch {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

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
        router.push("/pages/signup");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch {
      setError("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4" aria-live="polite">{error}</p>
        )}
        <form 
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off" 
          className="space-y-4"
        >
          {!isLogin && (
            <>
              <div className="relative">
                <FaUserPlus className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="pl-10 p-2 border rounded w-full focus:border-blue-500 text-black"
                />
              </div>
              <div className="relative">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="p-2 pl-10 border rounded w-full focus:border-blue-500 text-black"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
            </>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 p-2 border rounded w-full focus:border-blue-500 text-black"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 p-2 border rounded w-full focus:border-blue-500 text-black"
            />
          </div>
          <button
            type="button"
            onClick={isLogin ? handleLogin : handleSignup}
            className="flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded w-full transition hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : isLogin ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

