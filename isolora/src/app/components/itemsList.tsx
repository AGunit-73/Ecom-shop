"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface Item {
  itemid: number;
  name: string;
  category: string;
  description: string;
  price: number | string;
  quantity: number;
  image_url: string | null;
  user_id: number;
}

interface ItemListProps {
  selectedCategory: string;
}

export default function ItemList({ selectedCategory }: ItemListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quantityUpdates, setQuantityUpdates] = useState<{ [key: number]: number | undefined }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const { addItemToCart } = useCart();

  // Fetch items on component mount
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/product/get-items");
        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  // Filter items based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const toggleWishlist = (itemId: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(itemId)
        ? prevWishlist.filter((id) => id !== itemId)
        : [...prevWishlist, itemId]
    );
  };

  const handleDelete = async (itemId: number, userId: number) => {
    if (user?.id !== userId) {
      alert("You do not have permission to delete this item.");
      return;
    }

    if (!confirm("Are you sure you want to delete this item?")) return;

    const item = items.find((item) => item.itemid === itemId);
    const imageUrl = item?.image_url;

    if (!imageUrl) {
      alert("Image URL not found. Cannot delete item.");
      return;
    }

    try {
      const response = await fetch("/api/product/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemid: itemId, imageUrl }),
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.itemid !== itemId));
        alert("Item deleted successfully.");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item. Please try again later.");
    }
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }
    setQuantityUpdates((prev) => ({ ...prev, [itemId]: newQuantity }));
  };

  const handleUpdateQuantity = async (itemId: number, userId: number) => {
    if (user?.id !== userId) {
      alert("You do not have permission to update this item.");
      return;
    }

    const newQuantity = quantityUpdates[itemId];
    if (newQuantity === undefined || newQuantity < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch("/api/product/update-quantity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (response.ok) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.itemid === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        setQuantityUpdates((prev) => ({ ...prev, [itemId]: undefined }));
        alert("Quantity updated successfully.");
      } else {
        alert("Failed to update quantity.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {filteredItems.map((item) => (
        <div key={item.itemid} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4 relative">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>

          {item.image_url && (
            <Image
              src={item.image_url}
              alt={item.name}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded-md shadow-sm"
            />
          )}

          <p className="text-gray-600">{item.description}</p>
          <p className="text-gray-700 font-medium">
            Price: ${typeof item.price === "number" ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
          </p>

          {/* Vendor controls for updating and deleting items */}
          {user?.role === "vendor" && user.id === item.user_id && (
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="number"
                value={quantityUpdates[item.itemid] ?? item.quantity}
                onChange={(e) => handleQuantityChange(item.itemid, parseInt(e.target.value))}
                className="w-12 p-1 h-6 border border-gray-300 rounded text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
              <button
                onClick={() => handleUpdateQuantity(item.itemid, item.user_id)}
                className="px-2 py-1 bg-green-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(item.itemid, item.user_id)}
                className="px-2 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition duration-200 ease-in-out"
              >
                Delete
              </button>
            </div>
          )}

          {/* Wishlist and Add to Cart controls for all users */}
          {user && (
            <div className="flex items-center justify-between w-full mt-4 space-x-4">
              <button
                onClick={() => toggleWishlist(item.itemid)}
                className={`p-2 rounded-full ${
                  wishlist.includes(item.itemid) ? "text-red-600" : "text-gray-400"
                } hover:text-red-500 transition-colors duration-200`}
              >
                <HeartIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                onClick={() => addItemToCart(item.itemid)}
                className="p-2 rounded-full text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110 active:scale-90 duration-200 ease-in-out"
              >
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
