import { useEffect, useState } from "react";
import { useCart } from "../context/cartcontext";
import { useUser } from "../context/usercontext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { cartCount, fetchCartCount } = useCart();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogin = () => {
    router.push("pages/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setUser(null);
    router.push("/");
  };

  // Fetch cart count on component mount
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-3 bg-white shadow-md">
      <Link href="/">
        {/* Replace text with logo image */}
        <Image 
          src="/logo.PNG"  // Path to your logo file in the public folder
          alt="Isolora Logo"
          width={150}        // Adjust width as needed
          height={30}        // Adjust height as needed
          className="cursor-pointer"
        />
      </Link>
      
      <div className="flex items-center space-x-6">
        {/* Cart Icon with Count */}
        <Link href="/cart">
          <button className="relative">
            <Image 
              src="/cart-icon.png" 
              alt="Cart" 
              width={20} 
              height={20} 
              className="w-5 h-5" 
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* Conditional rendering for login/logout and add items */}
        {user ? (
          <div className="flex items-center space-x-4 relative">
            <p
              className="text-gray-700 font-semibold cursor-pointer relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {user.name}
            </p>
            {showTooltip && (
              <div className="absolute top-8 left-0 bg-gray-700 text-white text-xs rounded px-2 py-1 shadow-lg">
                User ID: {user.id}
              </div>
            )}
            {/* Show Add Items button only for vendors */}
            {user.role === "vendor" && (
              <Link href="/pages/add-items">
                <button className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                  Add Items
                </button>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm font-medium bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        ) : (
          // Show Login button only for customers or non-logged-in users
          <button
            onClick={handleLogin}
            className="px-4 py-2 font-medium text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
