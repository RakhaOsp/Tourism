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

// Sample travel packages data (in a real app, this would come from a database)
const travelPackages = {
  beach: [
    {
      id: "bali-luxury",
      destination: "Bali Luxury Resort Package",
      description: "Experience the ultimate luxury in Bali with this all-inclusive resort package.",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      price: "$2,499",
      duration: "7 days, 6 nights",
      highlights: [
        "Private villa with ocean view",
        "Daily spa treatments",
        "Cultural tours and activities",
        "Private beach access"
      ],
      includes: [
        "Round-trip flights",
        "All meals and premium drinks",
        "Airport transfers",
        "Daily activities and entertainment"
      ]
    },
    {
      id: "maldives-overwater",
      destination: "Maldives Overwater Villa Experience",
      description: "Stay in a luxurious overwater villa in the crystal-clear waters of the Maldives.",
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd",
      price: "$3,999",
      duration: "5 days, 4 nights",
      highlights: [
        "Overwater villa accommodation",
        "Underwater restaurant dining",
        "Snorkeling and diving trips",
        "Sunset cruise"
      ],
      includes: [
        "Seaplane transfers",
        "All-inclusive meals",
        "Water activities",
        "Romantic dinner setup"
      ]
    }
  ],
  city: [
    {
      id: "tokyo-explorer",
      destination: "Tokyo City Explorer",
      description: "Discover the perfect blend of traditional and modern Japan in Tokyo.",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      price: "$1,999",
      duration: "6 days, 5 nights",
      highlights: [
        "Guided city tours",
        "Traditional tea ceremony",
        "Robot restaurant experience",
        "Mount Fuji day trip"
      ],
      includes: [
        "Hotel accommodation",
        "Daily breakfast",
        "Public transport pass",
        "Airport transfers"
      ]
    }
  ],
  nature: [
    {
      id: "costa-rica-adventure",
      destination: "Costa Rica Adventure Package",
      description: "Experience the natural wonders and wildlife of Costa Rica.",
      imageUrl: "https://images.unsplash.com/photo-1518182170546-07661fd94144",
      price: "$2,299",
      duration: "8 days, 7 nights",
      highlights: [
        "Rainforest hiking",
        "Volcano tours",
        "Wildlife watching",
        "Beach relaxation"
      ],
      includes: [
        "Eco-lodge accommodation",
        "Most meals",
        "Guided tours",
        "Transportation"
      ]
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

    const isBeachRelated = lastUserMessage.includes("beach") ||
                          lastUserMessage.includes("beaches") ||
                          lastUserMessage.includes("ocean") ||
                          lastUserMessage.includes("sea");

    const isCityRelated = lastUserMessage.includes("city") ||
                         lastUserMessage.includes("urban") ||
                         lastUserMessage.includes("culture");

    const isNatureRelated = lastUserMessage.includes("nature") ||
                           lastUserMessage.includes("adventure") ||
                           lastUserMessage.includes("wildlife");

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
    let packages: any[] = [];

    // If the user is asking for suggestions or mentioning specific types of destinations,
    // add relevant travel packages
    if (isAskingForSuggestions) {
      packages = [
        ...travelPackages.beach,
        ...travelPackages.city,
        ...travelPackages.nature
      ];
    } else if (isBeachRelated) {
      packages = travelPackages.beach;
    } else if (isCityRelated) {
      packages = travelPackages.city;
    } else if (isNatureRelated) {
      packages = travelPackages.nature;
    }

    // Add a note about the packages to the response
    if (packages.length > 0) {
      response += "\n\nI've included some travel packages that might interest you. Each package includes accommodation, activities, and other amenities. Click 'View details' on any package to learn more, or use the 'Book Now' button to start your reservation.";
    }

    return NextResponse.json(
      { 
        response,
        packages
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