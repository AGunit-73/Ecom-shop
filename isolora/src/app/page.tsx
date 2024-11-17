"use client";
import { useState } from "react";
import Header from "./components/header";
import ItemList from "./components/itemsList";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories for the navbar
  const categories = ["All", "Indian Wear", "Western Wear", "Footwear"];

  // Function to handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="relative">
      {/* Floating Navbar */}
      <Header />

   

      {/* Category Navbar */}
      <nav className="flex justify-center mt-4 space-x-4 bg-white py-2 shadow-md sticky top-0 z-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-3 py-1 rounded-full font-medium ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center min-h-screen w-full max-w-6xl px-4">
        {/* Item List with Category Filter */}
        <ItemList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}

