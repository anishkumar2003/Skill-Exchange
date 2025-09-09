// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-6">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-indigo-600">SkillExchange</h1>
        <nav className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
          Learn New Skills.{" "}
          <span className="text-indigo-600">Share Yours.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Connect with peers, exchange skills, and grow together. Teach what you
          know and learn what excites you.
        </p>

        <div className="space-x-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
          >
            Explore
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SkillExchange. All rights reserved.
      </footer>
    </div>
  );
}
