"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";
import { ShoppingCartIcon, HeartIcon, StarIcon } from "@heroicons/react/24/solid";
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
  const [quantityUpdates, setQuantityUpdates] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const { addItemToCart } = useCart();

  // Generate fake ratings for items
  const generateFakeRating = () => Math.floor(Math.random() * 3) + 3; // Ratings between 3 and 5

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/product/get-items");
      const data = await response.json();
      setItems(
        data.items
          ? data.items.filter(
              (item: Item, index: number, self: Item[]) =>
                self.findIndex((i) => i.itemid === item.itemid) === index
            )
          : []
      );
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to load items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch wishlist items
  const fetchWishlist = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/wishlist/get-items?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setWishlist(data.wishlist.map((item: { productId: number }) => item.productId));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [user]);

  // Add or remove item from wishlist
  const toggleWishlist = async (itemId: number) => {
    if (!user?.id) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    try {
      if (wishlist.includes(itemId)) {
        const response = await fetch("/api/wishlist/remove-item", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId: itemId }),
        });

        if (response.ok) {
          setWishlist((prev) => prev.filter((id) => id !== itemId));
          alert("Removed from wishlist.");
        } else {
          alert("Failed to remove item from wishlist.");
        }
      } else {
        const response = await fetch("/api/wishlist/add-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId: itemId }),
        });

        if (response.ok) {
          setWishlist((prev) => [...prev, itemId]);
          alert("Added to wishlist.");
        } else {
          alert("Failed to add item to wishlist.");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Delete item
  const handleDelete = async (itemId: number, imageUrl: string | null) => {
    if (!user || user.role !== "vendor") {
      alert("You do not have permission to delete this item.");
      return;
    }
  
    if (!confirm("Are you sure you want to delete this item?")) return;
  
    try {
      const response = await fetch("/api/product/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemid: itemId, imageUrl }),
      });
  
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.itemid !== itemId));
        alert("Item deleted successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete item: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item. Please try again.");
    }
  };
  

  // Update quantity
  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (!user || user.role !== "vendor") {
      alert("You do not have permission to update this item.");
      return;
    }
  
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }
  
    try {
      const response = await fetch("/api/product/update-quantity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: itemId, quantity: newQuantity }),
      });
  
      if (response.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.itemid === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        alert("Quantity updated successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to update quantity: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("An error occurred while updating the quantity. Please try again.");
    }
  };
  
  
  
  // Filter items based on category
  useEffect(() => {
    setFilteredItems(
      selectedCategory === "All"
        ? items
        : items.filter((item) => item.category === selectedCategory)
    );
  }, [selectedCategory, items]);

  // Fetch items and wishlist on mount
  useEffect(() => {
    fetchItems();
    fetchWishlist();
  }, [fetchItems, fetchWishlist]);

  if (loading) return <p>Loading items...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {filteredItems.map((item) => {
        const rating = generateFakeRating();

        return (
          <div
            key={`${item.itemid}`}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4 transform transition-transform hover:scale-105"
          >
            {/* Item Image */}
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              />
            )}

            {/* Item Title */}
            <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>

            {/* Ratings */}
            <div className="flex items-center space-x-1">
              {Array(rating)
                .fill(null)
                .map((_, index) => (
                  <StarIcon key={index} className="h-5 w-5 text-yellow-400" />
                ))}
              {Array(5 - rating)
                .fill(null)
                .map((_, index) => (
                  <StarIcon key={index} className="h-5 w-5 text-gray-300" />
                ))}
              <span className="text-gray-500 text-sm">({rating}.0)</span>
            </div>

            {/* Item Price */}
            <p className="text-lg font-medium text-gray-700">
              Price: $
              {typeof item.price === "number"
                ? item.price.toFixed(2)
                : parseFloat(item.price).toFixed(2)}
            </p>

            {/* Wishlist and Cart Icons */}
            {user && (
              <div className="flex items-center space-x-4 mt-4">
                <HeartIcon
                  onClick={() => toggleWishlist(item.itemid)}
                  className={`h-6 w-6 cursor-pointer ${
                    wishlist.includes(item.itemid) ? "text-red-600" : "text-gray-400"
                  } hover:text-red-500`}
                />
                <ShoppingCartIcon
                  onClick={() => addItemToCart(item.itemid)}
                  className="h-6 w-6 cursor-pointer text-blue-500 hover:text-blue-600"
                />
              </div>
            )}

            {/* Vendor Options */}
            {/* Vendor Options */}
{user?.role === "vendor" && user.id === item.user_id && (
  <div className="flex items-center space-x-2 mt-2">
    {/* Quantity Input */}
    <input
      type="number"
      className="border border-gray-300 rounded px-2 py-1 w-12 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={quantityUpdates[item.itemid] ?? item.quantity}
      onChange={(e) =>
        setQuantityUpdates((prev) => ({
          ...prev,
          [item.itemid]: parseInt(e.target.value) || 0, // Prevent NaN
        }))
      }
    />

    {/* Update Button */}
    <button
      onClick={() =>
        handleUpdateQuantity(item.itemid, quantityUpdates[item.itemid] ?? item.quantity)
      }
      className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-400"
    >
      Update
    </button>

    {/* Delete Button */}
    <button
      onClick={() => handleDelete(item.itemid, item.image_url)} // Pass image_url to delete
      className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-400"
    >
      Delete
    </button>
  </div>
)}

          </div>
        );
      })}
    </div>
  );
}
