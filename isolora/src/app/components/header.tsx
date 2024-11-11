
"use client";

import { useUser } from "../context/usercontext";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from Next.js for navigation

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogin = () => {
    router.push("pages/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setUser(null);
    router.push("/"); // Navigate back to home or another page if desired
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">Isolora</div>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="text-right">
            <p className="font-semibold">{user.name}</p>
            <p className="font-semibold">{user.id}</p>
            {user.role === "vendor" && (
              <Link href="/pages/add-items">
                <button className="mt-1 px-3 py-1 text-sm font-medium bg-green-500 rounded hover:bg-green-600">
                  Add Items
                </button>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="mt-1 px-3 py-1 text-sm font-medium bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 font-medium text-sm bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
