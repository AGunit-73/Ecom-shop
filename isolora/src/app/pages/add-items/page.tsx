"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/usercontext";

interface Item {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  user_id: number;
}

interface BlobResult {
  url: string;
}

export default function ItemForm() {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const { user } = useUser();

  const [categories, setCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // ✅ Fetch categories from your backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        const names = data.categories.map((cat: { name: string }) => cat.name);
        setCategories(names);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      alert("User is not logged in.");
      return;
    }

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    if (parseFloat(price) <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    if (parseInt(quantity) <= 0) {
      alert("Quantity must be a positive integer.");
      return;
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(`/api/product/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const blob: BlobResult = await response.json();
    setBlobUrl(blob.url);

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
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        background: "linear-gradient(to right, #d4e4ff, #b8d3ff, #eaf4ff)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-lg space-y-6 text-black"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Item</h2>
          <p className="text-gray-500">Fill in the details below to add an item</p>
        </div>

        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Add Category Inline */}
        <div className="text-sm text-blue-600">
          {!showNewCategory ? (
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="underline hover:text-blue-800 mt-1"
            >
              + Add New Category
            </button>
          ) : (
            <div className="mt-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="w-full px-4 py-2 border border-blue-300 rounded-md mb-2"
              />
              <button
                type="button"
                disabled={!newCategory.trim()}
                onClick={async () => {
                  const res = await fetch("/api/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newCategory }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setCategories((prev) => [...prev, data.category.name]);
                    setCategory(data.category.name);
                    setNewCategory("");
                    setShowNewCategory(false);
                    alert("Category added!");
                  } else {
                    alert(data.message || "Failed to add category.");
                  }
                }}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Save Category
              </button>
            </div>
          )}
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24 resize-none"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          name="file"
          ref={inputFileRef}
          type="file"
          required
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all duration-200"
        >
          Upload Item
        </button>

        {blobUrl && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Image uploaded:{" "}
            <a href={blobUrl} className="text-blue-500 underline">
              {blobUrl}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
