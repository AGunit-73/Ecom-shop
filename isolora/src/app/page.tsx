import React from 'react';
import Header from "./components/header";
import ItemList from "./components/itemsList";
export default function Home() {
  return (
    <div>
      <Header/>
      <h1 className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        Isolora, we are up to somthing big 
      </h1>
      <div className="mt-4 flex justify-center sm:justify-start"><ItemList/></div>
    </div>
  );
}

