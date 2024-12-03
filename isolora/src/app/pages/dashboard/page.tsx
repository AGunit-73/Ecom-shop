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

interface Order {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  customer_name?: string; // Ensure optional or required based on API
  customer_email?: string; // Ensure optional or required based on API

  shipping_address?: string;
  order_status: string;
}

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
  const [ordersPlaced, setOrdersPlaced] = useState<Order[]>([]);
  const [ordersReceived, setOrdersReceived] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Orders and Wishlist Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        switch (activeTab) {
          case "orders":
            // Fetch Orders Placed
            const placedResponse = await fetch(
              `/api/orders/get-user-orders?customerId=${user.id}`
            );
            const placedData = await placedResponse.json();
            if (placedData.success) setOrdersPlaced(placedData.orders);

            // Fetch Orders Received
            const receivedResponse = await fetch(
              `/api/orders/get-vendor-orders?vendorId=${user.id}`
            );
            const receivedData = await receivedResponse.json();
            if (receivedData.success) setOrdersReceived(receivedData.orders);
            break;
          case "wishlist":
            // Fetch Wishlist Items
            const wishlistResponse = await fetch(
              `/api/wishlist/get-items?userId=${user.id}`
            );
            const wishlistData = await wishlistResponse.json();
            if (wishlistData.success) setWishlistItems(wishlistData.wishlist);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const renderOrders = (orders: Order[], isReceived: boolean = false) => {
    return orders.length > 0 ? (
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="p-4 bg-gray-100 rounded-md">
            <p>Order ID: {order.id}</p>
            {isReceived && (
              <>
                <p>Customer Name: {order.customer_name}</p>
                <p>Customer Email: {order.customer_email}</p>
              </>
            )}
            <p>Product Name: {order.product_name}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Shipping Address: {order.shipping_address}</p>
            <p>Status: {order.order_status}</p>
            {isReceived && (
              <select
                value={order.order_status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  await fetch(`/api/orders/update-status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId: order.id, status: newStatus }),
                  });
                }}
                className="mt-2 p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>{isReceived ? "No orders received." : "You have no orders."}</p>
    );
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
            <p>Name: {user.name || "Unknown"}</p>
            <p>Email: {user.email || "Unknown"}</p>
          </div>
        );
      case "orders":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Orders</h2>
            <div>
              <h3 className="font-semibold text-lg mb-2">Orders Placed</h3>
              {loading ? <p>Loading...</p> : renderOrders(ordersPlaced)}
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Orders Received</h3>
              {loading ? <p>Loading...</p> : renderOrders(ordersReceived, true)}
            </div>
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
<div className="flex flex-col min-h-screen mt-12">

      <div className="p-8">
        <h2 className="text-xl font-bold">{`Good ${getGreeting()}, ${user?.name || "Guest"}!`}</h2>
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
