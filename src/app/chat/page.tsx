'use client';

import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Personal Travel Assistant
        </h1>
        <div className="h-[80vh]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
} 