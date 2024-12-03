"use client";

import { useState, useRef } from "react";
import Header from "./components/header";
import ItemList from "./components/itemsList";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemListRef = useRef<HTMLDivElement | null>(null);

  // Categories for the navbar
  const categories = ["All", "Indian Wear", "Western Wear", "Footwear"];

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    itemListRef.current?.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to items
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Category Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="flex justify-center items-center py-2 space-x-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main
        ref={itemListRef}
        className="w-full max-w-6xl mx-auto flex-grow px-4 py-4"
      >
        {/* Section Title */}
        <h1 className="text-lg font-semibold text-gray-800 text-center mb-4">
           Christmas 50% OFF DEALS!
        </h1>

        {/* Item List */}
        <ItemList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}

