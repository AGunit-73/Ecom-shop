"use client";

import { useEffect, useState, useRef } from "react";
import { useCart } from "../context/cartcontext";
import { useUser } from "../context/usercontext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { cartCount, fetchCartCount } = useCart();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect to login/signup page
  const handleLogin = () => router.push("/pages/signup");

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setUser(null);
    router.push("/");
  };

  // Fetch cart count when the component mounts
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // Handle dropdown visibility
  const showDropdown = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownVisible(true);
  };

  const hideDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 300); // Delay to allow hover transitions
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-6 h-12">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logooo.jpg"
          alt="Isolora Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      </Link>

      {/* Navigation Menu */}
      <nav className="hidden md:flex space-x-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
        >
          Contact us
        </Link>
      </nav>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Cart Icon */}
        <Link href="/cart" className="relative">
          <Image
            src="/cart-icon.png"
            alt="Cart"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        {user ? (
          <div
            className="relative"
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
            ref={dropdownRef}
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 text-sm font-medium hidden lg:block">
                Hi, {user.name.split(" ")[0]}
              </span>
            </div>
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200">
                <Link
                  href="/pages/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                {user.role === "vendor" && (
                  <Link
                    href="/pages/add-items"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    Add Items
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
