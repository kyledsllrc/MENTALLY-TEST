import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!process.env.GEMINI_API_KEY });
});

// Non-clinical supportive AI Companion Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile, currentMood } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are MentAlly, a warm, compassionate, and empathetic AI wellness companion specifically designed for tertiary and college students in the Philippines.
Your core mission is to provide non-clinical emotional support, healthy coping mechanisms, stress management tips, academic relaxation advice, and reflective listening.

CRITICAL ETHICAL GUIDELINES & BOUNDARIES:
1. You are NOT a medical doctor, psychiatrist, or licensed clinical psychologist. You DO NOT diagnose, treat, or provide psychiatric medical advice.
2. Maintain a warm, validating, friendly, and non-judgmental tone. Understand the real pressures of Filipino college students (academic load, exams, thesis defense, commute, family expectations, burnout, financial pressures, sleep deprivation).
3. Always encourage practical self-care: deep breathing (e.g. 4-7-8 or box breathing), grounding (5-4-3-2-1 technique), stepping away from screens, taking hydration breaks, and journaling.
4. IF THE USER SHOWS SIGNS OF SEVERE DISTRESS, SELF-HARM, OR SUICIDAL THOUGHTS:
   Immediately express genuine care, de-escalate calmly, and strongly encourage reaching out to emergency hotlines:
   - National Center for Mental Health (NCMH) Crisis Hotline: 1553 (Nationwide toll-free) or 0917-899-8727 / 0966-351-4518
   - Hopeline Philippines: (02) 8804-4673 or 0917-558-4673
   - In Touch Community Services: (02) 8893-7603 or 0917-800-1123
   - Campus guidance counseling center (e.g., GAYON, Guidance Office).
5. Keep answers digestible and thoughtful (typically 2-4 supportive paragraphs), offering clear actionable micro-steps.`;

    if (!ai) {
      // High-quality contextual fallback response if API key is not yet set
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      const lower = lastUserMsg.toLowerCase();
      let reply = "Thank you for sharing that with me. Academic life and college challenges can feel heavy at times, but remember that your feelings are completely valid and you are not alone.";
      
      if (lower.includes("stress") || lower.includes("exam") || lower.includes("study") || lower.includes("thesis")) {
        reply = "College workloads and exam deadlines can definitely feel overwhelming. Remember to take it one assignment at a time. Have you tried our Box Breathing exercise or stepping away for a short 5-minute hydration break?";
      } else if (lower.includes("sad") || lower.includes("down") || lower.includes("cry") || lower.includes("lonely")) {
        reply = "I'm sending you gentle support. It takes courage to acknowledge when things feel difficult. Please be gentle with yourself today—you don't have to carry everything all at once. What is one small kind thing you can do for yourself right now?";
      } else if (lower.includes("anxious") || lower.includes("panic") || lower.includes("worried")) {
        reply = "I hear you, and we can slow things down together. Try placing both feet flat on the floor and taking three deep, slow breaths. You can also try our 5-4-3-2-1 Grounding exercise in the Activities tab to help anchor your mind in the present.";
      }
      return res.json({ reply });
    }

    // Format chat history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message,
      fallback: "I'm here for you. Taking a quiet moment to breathe and reflect can help bring calm when things feel busy. Feel free to explore our guided breathing and grounding activities.",
    });
  }
});

// Personalized AI Wellness Suggestions based on moods & journals
app.post("/api/recommendations", async (req, res) => {
  try {
    const { recentMoods, recentJournals } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        recommendations: [
          {
            title: "4-7-8 Deep Relaxation Breath",
            category: "Breathing",
            actionType: "breathing",
            duration: "3-5 mins",
            reason: "Helps calm the autonomic nervous system and lower study-related cortisol.",
            tip: "Practice this right before study sessions or before sleeping."
          },
          {
            title: "5-4-3-2-1 Sensory Grounding",
            category: "Mindfulness",
            actionType: "grounding",
            duration: "4 mins",
            reason: "Reconnects you with the physical environment when thoughts feel scattered.",
            tip: "Look around your study space and notice colors and textures."
          },
          {
            title: "Brain Dump & Gratitude Reflection",
            category: "Journaling",
            actionType: "journal",
            duration: "5 mins",
            reason: "Transferring busy mental thoughts to paper releases mental cognitive load.",
            tip: "Write down 3 tiny victories from your college day."
          }
        ]
      });
    }

    const prompt = `Analyze these recent student wellness records:
Recent Moods: ${JSON.stringify(recentMoods || [])}
Recent Journals Summary: ${JSON.stringify(recentJournals || [])}

Provide 3 personalized, highly actionable, non-clinical wellness activity recommendations tailored to this college student's emotional state.
Respond in valid JSON format only, structured as:
{
  "recommendations": [
    {
      "title": "Short title",
      "category": "Breathing | Mindfulness | Relaxation | Journaling",
      "actionType": "breathing | grounding | sounds | journal",
      "duration": "e.g. 3-5 mins",
      "reason": "Why this specifically helps based on recent mood and logs",
      "tip": "Actionable student tip"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Recommendations error:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Prompt generator for journaling
app.post("/api/journal-prompt", async (req, res) => {
  try {
    const { mood, category } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const defaultPrompts = [
        "What is one academic or personal task today that made you feel capable or proud?",
        "If you could whisper gentle advice to yourself this morning, what would it be?",
        "What is currently taking up the most mental space, and how can you give yourself permission to rest?",
        "Describe a small moment today that brought you a sense of comfort or peace.",
      ];
      const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
      return res.json({ prompt: randomPrompt });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Generate a single, deeply reflective, compassionate journaling prompt for a college student who is feeling "${mood || 'neutral'}" related to ${category || 'general student life and mental wellness'}. Give just the prompt question or statement, no quotes or preamble.`,
    });

    res.json({ prompt: response.text?.trim() });
  } catch (error) {
    res.status(500).json({ prompt: "What is one gentle kindness you can offer yourself today?" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MentAlly Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
