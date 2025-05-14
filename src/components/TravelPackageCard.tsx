'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TravelPackage {
  id: string;
  destination: string;
  description: string;
  imageUrl: string;
  price: string;
  duration: string;
  highlights: string[];
  includes: string[];
}

export default function TravelPackageCard({ package: travelPackage }: { package: TravelPackage }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-64 w-full">
        <Image
          src={travelPackage.imageUrl}
          alt={travelPackage.destination}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {travelPackage.destination}
        </h3>
        <p className="text-gray-600 mb-4">{travelPackage.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">{travelPackage.price}</span>
          <span className="text-gray-500">{travelPackage.duration}</span>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 underline mb-4"
        >
          {showDetails ? 'Show less' : 'View details'}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {travelPackage.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Package Includes:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {travelPackage.includes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 space-x-4">
          <button
            onClick={() => window.open('mailto:booking@travelai.com?subject=Booking Inquiry: ' + travelPackage.destination)}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
          <button
            onClick={() => window.open('https://wa.me/1234567890?text=I am interested in the ' + travelPackage.destination + ' package')}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
} 