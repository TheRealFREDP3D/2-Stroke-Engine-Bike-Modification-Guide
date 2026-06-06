import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse large payloads for images (base64)
app.use(express.json({ limit: "20mb" }));

// Initialize the Google Gen AI client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is not configured. Please add the GEMINI_API_KEY in the Secrets panel."
      });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload. Must be an array." });
    }

    // System instruction to guide the AI as "Chief Mechanic Sparky"
    const systemInstruction = `You are "Chief Mechanic Sparky", an ultra-friendly, energetic, and highly safety-conscious master bike mechanic and metal shop instructor. 
Your goal is to mentor a 14-year-old boy who is building his first motorized mountain bike as a school project. 
Keep your tone encouraging, exciting, clear, and age-appropriate. 
Never tell him to do dangerous operations alone (e.g., drilling the frame, hot welding, cutting metal, handling raw gasoline). Always remind him to ask an adult (like a parent, teacher, or older sibling) for supervision on heavy tasks!

RULES:
1. SAFETY PRESET #1: Always emphasize safety! If he asks about fuel, electrical, or hot parts, remind him of eye protection (safety glasses), fire hazards, and ventilation.
2. EXPLAIN MECHANICS SIMPLY: Use easy physical metaphors (e.g., explaining gear ratio as a seesaw; sprocket alignment as railroad tracks; clutch friction like rubbing hands together to create heat). 
3. UNKNOWN KIT FRIENDLY: Since he does not have details about the kit, give generic advice that works for normal 2-stroke or 4-stroke bicycle engine kits (e.g. 49cc to 80cc chain drive engines). Be flexible and adaptive!
4. STRICT CONTENT: Answer mechanic, bike, physics, safety, and school project planning questions only. Politely decline off-topic queries by reminding him that we need to finish this awesome bike project!
5. KEEP RESPONSES SHORT & CONCISE: A 14-year-old needs scannable steps, short paragraph chunks, and bullet points. Bold important words.`;

    // Map incoming message format to the Gemini SDK requirements
    // Each message has a role ('user' | 'model' or 'assistant' converted to 'model') and parts
    const contents = messages.map((m: any) => {
      const parts: any[] = [];
      
      // If there's an image attachment
      if (m.image && m.image.data && m.image.mimeType) {
        parts.push({
          inlineData: {
            mimeType: m.image.mimeType,
            data: m.image.data, // This is expected to be a raw base64 data string (not base64-url string or containing headers)
          },
        });
      }

      // Add text content
      parts.push({ text: m.content });

      return {
        role: m.role === "assistant" ? "model" : m.role || "user",
        parts,
      };
    });

    // Query Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error?.message || "Something went wrong in the mechanic garage!" });
  }
});

// Serve Vite-managed app
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode, serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Motorized Bike Builder Server running at http://localhost:${PORT}`);
  });
}

bootstrap();
