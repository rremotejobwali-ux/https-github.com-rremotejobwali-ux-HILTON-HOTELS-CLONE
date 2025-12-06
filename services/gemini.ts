import { GoogleGenAI, Type } from "@google/genai";
import { Hotel } from "../types";

// Mock data to fallback on if API key is missing or fails
const MOCK_HOTELS: Hotel[] = [
  {
    id: "h1",
    name: "Grand Plaza Paris",
    location: "Paris, France",
    pricePerNight: 450,
    rating: 4.8,
    image: "https://picsum.photos/seed/h1/800/600",
    description: "Experience luxury in the heart of Paris with stunning views of the Eiffel Tower. Our 5-star hotel features world-class dining, an award-winning spa, and elegantly appointed rooms that blend classic Parisian charm with modern amenities.",
    amenities: ["Spa", "Pool", "Free WiFi", "Gym", "Restaurant", "Concierge", "Room Service", "Bar"],
    reviews: 1240,
    availableRooms: 12
  },
  {
    id: "h2",
    name: "Seaside Retreat",
    location: "Nice, France",
    pricePerNight: 320,
    rating: 4.5,
    image: "https://picsum.photos/seed/h2/800/600",
    description: "A beautiful beachfront property offering serene views and relaxation. Wake up to the sound of waves and enjoy our private beach access. Perfect for couples and families looking for a coastal escape.",
    amenities: ["Beach Access", "Pool", "Bar", "Free WiFi", "Kids Club", "Water Sports"],
    reviews: 850,
    availableRooms: 5
  },
  {
    id: "h3",
    name: "Alpine Lodge",
    location: "Chamonix, France",
    pricePerNight: 280,
    rating: 4.7,
    image: "https://picsum.photos/seed/h3/800/600",
    description: "Cozy mountain retreat perfect for skiing enthusiasts and nature lovers. Features a rustic design with modern comforts, including a large stone fireplace in the lobby and heated ski storage.",
    amenities: ["Ski-in/Ski-out", "Sauna", "Fireplace", "Breakfast", "Mountain View", "Hiking Trails"],
    reviews: 500,
    availableRooms: 8
  }
];

export const searchHotelsWithGemini = async (location: string): Promise<Hotel[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API key found, using mock data.");
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!location) return MOCK_HOTELS;
    // Simple filter for mock data
    return MOCK_HOTELS.map(h => ({
        ...h,
        location: location.length > 2 ? `${location}` : h.location
    }));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 6 realistic fictional hotels in or near ${location || "popular destinations"}. 
      Include a mix of luxury and mid-range options. 
      Use varied price points (between $100 and $800). 
      Make descriptions appealing and around 20-30 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              pricePerNight: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              description: { type: Type.STRING },
              amenities: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reviews: { type: Type.INTEGER },
              availableRooms: { type: Type.INTEGER }
            },
            required: ["id", "name", "location", "pricePerNight", "rating", "description", "amenities", "reviews"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((hotel: any, index: number) => ({
      ...hotel,
      id: hotel.id || `gen-${index}-${Date.now()}`,
      image: `https://picsum.photos/seed/${hotel.name.replace(/[^a-zA-Z0-9]/g, '')}/800/600`
    }));

  } catch (error) {
    console.error("Gemini search failed:", error);
    return MOCK_HOTELS;
  }
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
  // Check mocks first
  const mock = MOCK_HOTELS.find(h => h.id === id);
  if (mock) return mock;

  // Since we don't have a backend to query by ID, and Gemini is stateless,
  // we will try to "re-imagine" the hotel based on the ID or just generate a generic luxury hotel.
  // In a real app, this would query a DB.
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) return undefined;

  try {
     const ai = new GoogleGenAI({ apiKey });
     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate details for a luxury hotel. 
      The ID suggests it might be a specific type, but just generate a generic high-end hotel description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              pricePerNight: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              description: { type: Type.STRING },
              amenities: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reviews: { type: Type.INTEGER },
              availableRooms: { type: Type.INTEGER }
          },
          required: ["name", "location", "pricePerNight", "description"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    if (!data.name) return undefined;

    return {
        ...data,
        id: id, // keep the requested ID
        image: `https://picsum.photos/seed/${id}/800/600`
    }
  } catch (e) {
      return undefined;
  }
};