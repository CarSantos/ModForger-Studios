import { GoogleGenAI, Type } from '@google/genai';

// Initialize the GoogleGenAI client
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY process environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
}

export const generateModNodes = async (prompt: string) => {
  const ai = getAIClient();
  
  const systemInstruction = `
    You are a Minecraft Modding expert working on ModForger Studios.
    Your task is to generate React Flow nodes for Minecraft Mod logic based on the user's prompt.
    You MUST respond with pure JSON ONLY. No markdown formatted blocks, no text before or after.
    The nodes and edges should be compatible with @xyflow/react.
    Categories for nodes can be: "event", "action", "condition", "data_math", "variable", "api", "item".
    Each node must have an id, type (set to "custom"), position (x, y), and data.
    The data object must contain "label" and "category".
    Ids must be short random alphanumeric strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { type: Type.STRING },
                            position: { 
                                type: Type.OBJECT,
                                properties: {
                                    x: { type: Type.NUMBER },
                                    y: { type: Type.NUMBER }
                                },
                                required: ["x", "y"]
                            },
                            data: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING },
                                    category: { type: Type.STRING }
                                },
                                required: ["label", "category"]
                            }
                        },
                        required: ["id", "type", "position", "data"]
                    }
                },
                edges: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            source: { type: Type.STRING },
                            target: { type: Type.STRING },
                            sourceHandle: { type: Type.STRING },
                            targetHandle: { type: Type.STRING }
                        },
                        required: ["id", "source", "target"]
                    }
                }
            },
            required: ["nodes", "edges"]
        }
      }
    });

    let rawText = response.text;
    if (!rawText) throw new Error("No text returned from AI");

    // Sanitizer - just in case the AI ignored responseMimeType
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
       rawText = rawText.substring(startIndex, endIndex + 1);
    }
    
    return JSON.parse(rawText);

  } catch (err: any) {
    console.error("AI Generation Error", err);
    throw new Error(err.message || "Failed to generate nodes");
  }
};

