// src/app/components/ItemForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useUser } from "@/app/context/usercontext";

// Define the Item and BlobResult interfaces
interface Item {
  name: string;
  category:string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  user_id:number
}

interface BlobResult {
  url: string;
}

export default function ItemForm() {
  const router = useRouter(); // Initialize the router
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const { user } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      alert("User is not logged in.");
      return;
    }
  

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    // Upload the file to the Vercel Blob API
    const response = await fetch(`/api/product/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const blob: BlobResult = await response.json();

    // Set the blob URL after upload
    setBlobUrl(blob.url);

    // Now save item details with the image URL to the database
    const newItem: Item = {
      name,
      category,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl: blob.url,
      user_id: user.id,
    };

    await fetch("/api/product/add-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    alert("Item added successfully!");
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Add New Item</h2>
      
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 h-24 resize-none"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
      />

      <input
        name="file"
        ref={inputFileRef}
        type="file"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Upload Item
      </button>

      {blobUrl && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Image uploaded:{" "}
          <a href={blobUrl} className="text-blue-500 underline">
            {blobUrl}
          </a>
        </p>
      )}
    </form>
  );
}
