"use client";

import { useEffect, useState, useRef } from "react";
import { useCart } from "../context/cartcontext";
import { useUser } from "../context/usercontext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { cartCount, fetchCartCount } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle login redirection
  const handleLogin = () => {
    router.push("/pages/signup");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setUser(null);
    router.push("/");
  };

  // Fetch cart count when the component mounts
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // Adjust header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Show dropdown with a delay
  const showDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownVisible(true);
  };

  // Hide dropdown with a delay
  const hideDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 300); // Delay of 300ms
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all ${
          isCollapsed ? "py-2" : "py-4"
        } flex items-center justify-between px-4 lg:px-12`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logooo.jpg"
            alt="Isolora Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <Image
              src="/cart-icon.png"
              alt="Cart"
              width={25}
              height={25}
              className="cursor-pointer"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
              ref={dropdownRef}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-600 font-medium">
                  Hi, {user.name.split(" ")[0]}
                </span>
              </div>
              {/* Tooltip Dropdown */}
              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                  <Link
                    href="/pages/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                  {user.role === "vendor" && (
                    <Link
                      href="/pages/add-items"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    >
                      Add Items
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="bg-gray-100">
        <Swiper
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Pagination, Autoplay]}
          className="w-full h-[300px] md:h-[400px]"
        >
          <SwiperSlide>
            <div
              className="flex items-center justify-center h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/slide-2.jpg')",
              }}
            >
              <div className="text-white text-center bg-black bg-opacity-50 p-6 rounded-lg">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Discover Your Style
                </h1>
                <p className="text-lg">
                  Shop the latest collections and redefine fashion.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="flex items-center justify-center h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/slide-1.jpg')",
              }}
            >
              <div className="text-white text-center bg-black bg-opacity-50 p-6 rounded-lg">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Exclusive Offers
                </h1>
                <p className="text-lg">Up to 50% off on your favorite brands.</p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="flex items-center justify-center h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/slide-3.jpg')",
              }}
            >
              <div className="text-white text-center bg-black bg-opacity-50 p-6 rounded-lg">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Shop Now, Pay Later
                </h1>
                <p className="text-lg">
                  Flexible payment options available for all.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </>
  );
};

export default Header;
