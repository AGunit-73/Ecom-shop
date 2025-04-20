"use client";

import { useEffect, useState, useRef } from "react";
import Header from "./components/header";
import ItemList from "./components/itemsList";
import HeroSwiper from "./components/heroSwiper";

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        const names = data.categories.map((cat: { name: string }) => cat.name);
        setCategories(["All", ...names]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories(["All"]); // fallback if API fails
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    itemListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <HeroSwiper />

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
        <ItemList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
