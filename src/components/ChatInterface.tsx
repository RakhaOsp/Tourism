'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import TravelPackageCard from './TravelPackageCard';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  packages?: TravelPackage[];
}

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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI travel assistant. I can help you plan your perfect trip. Are you looking for specific destinations, or would you like to explore popular options?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiMessage: Message = {
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        packages: data.packages || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="prose">
                {message.content}
              </div>
              {message.packages && message.packages.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-6">
                  {message.packages.map((pkg) => (
                    <TravelPackageCard key={pkg.id} package={pkg} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLoading ? "AI is thinking..." : "Ask about your next adventure..."}
            disabled={isLoading}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 