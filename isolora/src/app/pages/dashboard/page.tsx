"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/usercontext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi";

interface WishlistItem {
  product_id: number;
  name: string;
  price: string;
  image_url: string | null;
}

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (activeTab === "wishlist" && user) {
        setLoading(true);
        try {
          const response = await fetch(`/api/wishlist/get-items?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setWishlistItems(data.wishlist);
          } else {
            console.error("Failed to fetch wishlist:", data.message);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [activeTab, user]);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please Log In</h2>
          <button
            onClick={() => router.push("/pages/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <p>Name: {user?.name || "Unknown"}</p>
            <p>Email: {user?.email || "Unknown"}</p>
          </div>
        );
      case "orders":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <ul>
              <li key="order-1234">Order #1234 - $100.00</li>
              <li key="order-5678">Order #5678 - $50.00</li>
            </ul>
          </div>
        );
      case "wishlist":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Wishlist</h2>
            {loading ? (
              <p>Loading wishlist...</p>
            ) : wishlistItems.length > 0 ? (
              <ul className="space-y-4">
                {wishlistItems.map((item) => (
                  <li
                    key={item.product_id}
                    className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md"
                  >
                    <Image
                      src={item.image_url || "/placeholder-image.png"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your wishlist is empty.</p>
            )}
          </div>
        );
      case "faqs":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {[
                {
                  question: "How do I update my profile?",
                  answer:
                    "You can update your profile by navigating to the &quot;Profile&quot; tab and clicking the &quot;Edit&quot; button.",
                },
                {
                  question: "How do I track my orders?",
                  answer:
                    "Go to the &quot;Orders&quot; tab in the dashboard to see your order history and track the status of your orders.",
                },
                {
                  question: "How can I contact support?",
                  answer: "Use the &quot;Contact Us&quot; tab or email us at support@example.com.",
                },
              ].map((faq, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded">
                  <details>
                    <summary className="font-semibold cursor-pointer">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        );
      case "contact":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        );
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  // Sidebar tabs
  const tabs = [
    { key: "profile", icon: <FiUser />, label: "Profile" },
    { key: "orders", icon: <FiShoppingBag />, label: "Orders" },
    { key: "wishlist", icon: <FiHeart />, label: "Wishlist" },
    { key: "faqs", icon: <FiHelpCircle />, label: "FAQs" },
    { key: "contact", icon: <FiMessageSquare />, label: "Contact Us" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8">
        <h2 className="text-xl font-bold">
          {`Good ${getGreeting()}, ${user?.name || "Guest"}!`}
        </h2>
      </div>
      <div className="flex">
        <aside className="w-1/4 bg-gray-100 p-4 min-h-screen">
          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 rounded transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="w-3/4 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
