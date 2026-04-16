const DEFAULT_MODEL = "nousresearch/hermes-3-llama-3.1-405b:free";

const callOpenRouter = async ({ systemPrompt, userPrompt, temperature = 0.2, maxTokens = 1000 }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in environment variables");
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_NAME || "Learning Backend",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    const message = body?.error?.message || body?.message || "OpenRouter request failed";
    throw new Error(message);
  }

  return body?.choices?.[0]?.message?.content || "";
};

const safeJsonParse = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (!fenced) {
      return null;
    }

    try {
      return JSON.parse(fenced[1]);
    } catch (_innerError) {
      return null;
    }
  }
};

module.exports = {
  callOpenRouter,
  safeJsonParse,
  DEFAULT_MODEL,
};
