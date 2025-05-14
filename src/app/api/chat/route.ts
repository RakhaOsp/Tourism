import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Configure API key
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not configured in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey
});

// Sample destination data (in a real app, this would come from a database)
const popularDestinations = {
  beach: [
    {
      name: "Maldives",
      description: "Luxury overwater villas and pristine beaches",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200"
    },
    {
      name: "Bali",
      description: "Tropical paradise with rich culture",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200"
    }
  ],
  city: [
    {
      name: "Tokyo",
      description: "Modern metropolis with traditional charm",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200"
    },
    {
      name: "Paris",
      description: "City of lights and romance",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200"
    }
  ],
  nature: [
    {
      name: "Swiss Alps",
      description: "Majestic mountains and scenic views",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200"
    },
    {
      name: "Costa Rica",
      description: "Rainforests and wildlife adventures",
      image: "https://images.unsplash.com/photo-1518182170546-07661fd94144?w=1200"
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if the user is asking for destination suggestions
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
    const isAskingForSuggestions = lastUserMessage.includes("don't know") || 
                                  lastUserMessage.includes("suggest") || 
                                  lastUserMessage.includes("recommendations") ||
                                  lastUserMessage.includes("popular") ||
                                  lastUserMessage.includes("options");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable travel assistant. Help users plan their trips by providing detailed information about destinations, suggesting itineraries, and giving travel tips. Be concise but informative. Focus on practical advice and local insights. If asked about prices, always mention that prices are estimates and may vary.

When suggesting destinations, focus on these aspects:
1. Best time to visit
2. Must-see attractions
3. Estimated budget range
4. Local cuisine highlights
5. Accommodation recommendations

If the user seems undecided, suggest popular destinations based on their interests or the season.`
        } as ChatCompletionMessageParam,
        ...messages.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        } as ChatCompletionMessageParam))
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    let response = completion.choices[0].message.content;
    let images: string[] = [];

    // If the user is asking for suggestions, add images from our popular destinations
    if (isAskingForSuggestions) {
      const allDestinations = [
        ...popularDestinations.beach,
        ...popularDestinations.city,
        ...popularDestinations.nature
      ];
      images = allDestinations.slice(0, 4).map(dest => dest.image);
      
      // Add a note about the images to the response
      response += "\n\nI've included some images of popular destinations for your inspiration. Would you like more specific information about any of these places?";
    }

    return NextResponse.json(
      { 
        response,
        images
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 