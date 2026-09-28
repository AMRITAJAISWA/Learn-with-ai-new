import { generateWithGroq, getGroqApiKey } from "./groq";
import { generateWithGemini, getGeminiApiKey } from "./gemini";

export interface LlmCallOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  responseFormatJson?: boolean;
  imageUrl?: string;
  maxTokens?: number;
}

/**
 * AI Layer for LearnWithAI
 * Powered primarily by Groq Cloud for lightning-fast inference,
 * with fallbacks to Google Gemini, OpenRouter, and public educational engines.
 */
export async function callLlmApi(options: LlmCallOptions): Promise<string | null> {
  const groqKey = getGroqApiKey();
  const geminiKey = getGeminiApiKey();
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  // 1. Groq Cloud (Ultra Fast)
  if (groqKey) {
    try {
      const groqResponse = await generateWithGroq({
        systemPrompt: options.systemPrompt,
        userPrompt: options.userPrompt,
        temperature: options.temperature,
        responseFormatJson: options.responseFormatJson,
        maxTokens: options.maxTokens,
      });

      if (groqResponse && groqResponse.trim().length > 0) {
        return groqResponse;
      }
    } catch (err) {
      console.warn("Groq Cloud generation failed, attempting fallbacks:", err);
    }
  }

  // 2. Google Gemini (Multimodal / Fallback)
  if (geminiKey) {
    try {
      const geminiResponse = await generateWithGemini({
        systemPrompt: options.systemPrompt,
        userPrompt: options.userPrompt,
        temperature: options.temperature,
        responseFormatJson: options.responseFormatJson,
        imageUrl: options.imageUrl,
      });

      if (geminiResponse && geminiResponse.trim().length > 0) {
        return geminiResponse;
      }
    } catch (err) {
      console.warn("Google Gemini generation failed, attempting fallbacks:", err);
    }
  }

  // 3. OpenRouter Free Tier
  if (openrouterKey && openrouterKey.trim() !== "") {
    try {
      const messages = [];
      if (options.systemPrompt) {
        messages.push({ role: "system", content: options.systemPrompt });
      }
      messages.push({ role: "user", content: options.userPrompt });

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages,
          temperature: options.temperature ?? 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err) {
      console.warn("OpenRouter Free API failed:", err);
    }
  }

  // 4. Zero-Key Public Free AI Engine (Pollinations.ai)
  // No key required, completely free, public educational inference
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let prompt = options.userPrompt;
    if (options.systemPrompt) {
      prompt = `${options.systemPrompt}\n\nTask: ${options.userPrompt}`;
    }
    if (options.responseFormatJson) {
      prompt += "\n\nCRITICAL: Respond ONLY with a raw, valid JSON object. Do not wrap in markdown ```json code blocks. Do not add any text before or after the JSON.";
    }

    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    // Try POST first
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "openai",
          seed: Math.floor(Math.random() * 10000),
        }),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 10) {
          clearTimeout(timeoutId);
          return text.trim();
        }
      }
    } catch {
      // Fallback to GET
    }

    // Secondary GET fallback if POST didn't return text
    const cleanPrompt = encodeURIComponent(prompt.substring(0, 1500));
    const getRes = await fetch(`https://text.pollinations.ai/${cleanPrompt}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (getRes.ok) {
      const text = await getRes.text();
      if (text && text.trim().length > 10) {
        return text.trim();
      }
    }
  } catch (err) {
    // Zero-key public service was unreachable or timed out
  }

  // 5. Return null to signal the caller to use the instant high-fidelity local neural heuristic engine
  return null;

}
