import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets or in your Vercel project environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // CORS setup for Vercel hosting
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const { text, clientTime } = req.body || {};
    if (!text || typeof text !== "string" || text.trim() === "") {
      res.status(400).json({ success: false, error: "Missing or invalid 'text' payload." });
      return;
    }

    const ai = getGemini();
    const timeContext = clientTime || new Date().toISOString();

    const prompt = `Extract transaction details from the following user natural language text:
"${text}"

Current timestamp reference for resolving relative dates (like "today", "yesterday", "last week Wednesday"): ${timeContext}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a precise personal finance Data Extraction Assistant.
Your task is to analyze the user's input and extract transaction details.
You must adhere strictly to these rules:
1. "amount": Extract the total money spent or received as an Integer (round to nearest integer if fractional, absolute value, e.g. 15 for 15.42, 100 for $100).
2. "transaction_type": Must be exactly "expense" (if money went out) or "income" (if money came in).
3. "category": Must be one of the following exact string values: "Food", "Transportation", "Utilities", "Entertainment", "Education", "Shopping", "Investment", "Income", "Others".
4. "payment_method": Standardize the method (e.g., "Cash", "Debit", "Credit", "E-Wallet", or "Unknown").
5. "description": A brief, clean, and plain human summary of what the transaction was for (e.g., "Lunch at McDonald's"). Ignore filler words.
6. "date": Calculate the precise date and time of the transaction based on the text. Format it as an ISO-8601 string. If no date is specified, use the reference current time: ${timeContext}.
7. Return ONLY a valid JSON object matching the requested schema. No conversational filler or markdown markers outside the JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: {
              type: Type.INTEGER,
              description: "The total money spent or received as an Integer.",
            },
            transaction_type: {
              type: Type.STRING,
              description: "Must be 'expense' or 'income'.",
            },
            category: {
              type: Type.STRING,
              description: "Must be Food, Transportation, Utilities, Entertainment, Education, Shopping, Investment, Income, or Others.",
            },
            payment_method: {
              type: Type.STRING,
              description: "The payment method matching the source input (e.g., Cash, Debit, Credit, E-Wallet, Unknown).",
            },
            description: {
              type: Type.STRING,
              description: "A clean, concise description of the transaction.",
            },
            date: {
              type: Type.STRING,
              description: "The ISO-8601 string of the date and time of the transaction, resolved using the reference current time.",
            },
          },
          required: ["amount", "transaction_type", "category", "payment_method", "description", "date"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      res.status(500).json({ success: false, error: "No response text received from Gemini API." });
      return;
    }

    const data = JSON.parse(resultText.trim());
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Extraction error:", error);
    res.status(500).json({ success: false, error: error.message || "An error occurred during data extraction." });
  }
}
