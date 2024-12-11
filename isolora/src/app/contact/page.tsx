"use client";

import React from "react";
import {
  FaHome,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa"; // Importing icons

const ContactPage = () => {
  return (
    <div className="p-8 md:p-16 bg-white text-gray-800">
      {/* Interactive Heading */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center relative group">
      <span className="text-blue-600 group-hover:text-blue-400 transition-colors duration-300">
              Contact us
            </span>
        <div className="w-0 h-1 bg-blue-500 mt-2 mx-auto group-hover:w-full transition-all duration-500"></div>
      </h1>

      <p className="text-lg mb-12 text-center">
        Have questions or feedback? Reach out to us through the form below or
        using the provided contact details.
      </p>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Address</h3>
              <p className="text-sm">
                300 South Grand Blvd, <br />
               Saint Louis, 63103
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
              <FaPhoneAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Phone</h3>
              <p className="text-sm">571-457-2321</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-sm">contact@isolora.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Send Message</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
