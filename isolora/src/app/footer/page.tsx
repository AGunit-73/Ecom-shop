"use client";

import Link from "next/link";
import { HomeIcon, InformationCircleIcon, PhoneIcon } from "@heroicons/react/24/solid";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 shadow-lg">
      {/* Navigation Icons */}
      <div className="flex justify-around items-center pb-2 border-b border-gray-700">
        <Link href="/" className="flex flex-col items-center text-white hover:text-blue-400 transition">
          <HomeIcon role="img" className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link href="/about" className="flex flex-col items-center text-white hover:text-blue-400 transition">
          <InformationCircleIcon role="img" className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">About Us</span>
        </Link>

        <Link href="/contact" className="flex flex-col items-center text-white hover:text-blue-400 transition">
          <PhoneIcon role="img" className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Contact</span>
        </Link>
      </div>

      {/* Copyright Section */}
      <div className="text-center pt-2">
        <p className="text-xs font-light">© {new Date().getFullYear()} Team Isolora. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
