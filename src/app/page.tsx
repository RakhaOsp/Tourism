import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-blue-600">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero-bg.jpg"
            alt="Travel destinations"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your AI Travel Companion
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
              Experience personalized travel planning with our AI assistant. Get instant recommendations, book trips, and discover hidden gems.
            </p>
            <Link
              href="/chat"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Planning Your Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Travel Assistant?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Personalized Planning</h3>
              <p className="text-gray-600">
                Get customized travel recommendations based on your preferences, budget, and travel style.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Real-Time Assistance</h3>
              <p className="text-gray-600">
                24/7 AI support to answer your questions and help you make informed decisions about your trip.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Visual Inspiration</h3>
              <p className="text-gray-600">
                Explore destinations with beautiful images and get a preview of what your dream vacation could look like.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

