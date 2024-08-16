import React from "react";
import { Link } from "react-router-dom";
import { Heart, WineOff } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <img src="/xl.png" className="mx-auto mb-6 w-16 h-16 rounded-full" />
        <h1 className="text-4xl font-bold text-white mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 flex items-center justify-center">
          <WineOff className="text-red-500 mr-2" />
          Whoops! This page is not available.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          But there's still more to explore on our site.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
        >
          Back to Hot
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
