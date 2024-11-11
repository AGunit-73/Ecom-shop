
"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/usercontext"; // Import the user context

interface Item {
  itemid: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string | null;
  user_id:number;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useUser(); // Get user data from the context

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/product/get-items");
      const data = await res.json();
      setItems(data.items);
    }

    fetchItems();
  }, []);

  // Function to delete an item
  const deleteItem = async (itemid: number, user_id: number, imageUrl: string) => {

    if (user?.id !== user_id) {
      alert("You do not have permission to delete this item.");
      return;
    }

    const res = await fetch("/api/product/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemid, imageUrl }),
    });

    const data = await res.json();
    if (data.success) {
      setItems((prevItems) => prevItems.filter((item) => item.itemid !== itemid));
      alert("Item deleted successfully");
    } else {
      alert(data.message || "Failed to delete item");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {items.map((item) => (
        <div
          key={item.itemid}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          
          <p className="text-gray-600">{item.description}</p>
          <p className="text-gray-700 font-medium">Price: ${item.price}</p>
          <p className="text-gray-700 font-medium">Quantity: {item.quantity}</p>
          
          {/* Only show the delete button if the user role is "vendor" */}
          {user?.role === "vendor" && (
            <button
              onClick={() => {
                // Only call deleteItem if image_url is not null
                if (item.image_url) {
                  deleteItem(item.itemid, item.user_id, item.image_url);
                } else {
                  alert("Image URL is missing. Cannot delete item image.");
                }
              }}
              className="w-full py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}


