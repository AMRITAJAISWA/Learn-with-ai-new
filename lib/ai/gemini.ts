import { GoogleGenerativeAI, Part } from "@google/generative-ai";

export const GEMINI_MODEL = process.env.LLM_MODEL || "gemini-1.5-flash";

/**
 * Retrieves the Google Gemini API Key from environment variables.
 */
export function getGeminiApiKey(): string | null {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.LLM_API_KEY;
  return key && key.trim() !== "" ? key.trim() : null;
}

/**
 * Initializes the Google Generative AI instance if an API key is available.
 */
export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Converts a data URL (e.g. data:image/png;base64,...) or raw base64 string into a Gemini Part.
 */
export function parseImageToPart(imageUrlOrBase64: string): Part | null {
  try {
    if (imageUrlOrBase64.startsWith("data:")) {
      const matches = imageUrlOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        return {
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        };
      }
    } else {
      // Assume raw base64 string or jpeg default
      return {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageUrlOrBase64,
        },
      };
    }
  } catch (err) {
    console.warn("Failed to parse image for Gemini:", err);
  }
  return null;
}

export interface GeminiGenerateOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  responseFormatJson?: boolean;
  imageUrl?: string;
}

export const PREFERRED_MODELS = [
  process.env.LLM_MODEL,
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
].filter(Boolean) as string[];

/**
 * Generates text or structured JSON using Google Gemini API.
 */
export async function generateWithGemini(
  options: GeminiGenerateOptions
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;

  for (const modelName of PREFERRED_MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemPrompt,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          responseMimeType: options.responseFormatJson
            ? "application/json"
            : "text/plain",
        },
      });

      const parts: (string | Part)[] = [];

      // Multimodal support: if image is supplied, include it
      if (options.imageUrl) {
        const imagePart = parseImageToPart(options.imageUrl);
        if (imagePart) {
          parts.push(imagePart);
        }
      }

      parts.push(options.userPrompt);

      const result = await model.generateContent(parts);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (error: any) {
      // If 404 model not found or deprecated, try next model version
      console.warn(`Gemini (${modelName}) failed, trying alternate model:`, error?.message || error);
    }
  }

  return null;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GeminiChatOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
}

/**
 * Conducts multi-turn conversational chat with Google Gemini 1.5 Flash.
 */
export async function chatWithGemini(
  options: GeminiChatOptions
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    const model = client.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: options.systemPrompt,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
      },
    });

    // Prepare history: Gemini expects user / model roles
    const historyMessages = options.messages.slice(0, -1);
    const lastMessage = options.messages[options.messages.length - 1];

    if (!lastMessage || !lastMessage.content) return null;

    const formattedHistory = historyMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    return text ? text.trim() : null;
  } catch (error) {
    console.error(`Gemini (${GEMINI_MODEL}) chat failed:`, error);
    return null;
  }
}
