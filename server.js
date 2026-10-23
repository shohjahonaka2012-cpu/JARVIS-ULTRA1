require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, provider: "groq", configured: Boolean(process.env.GROQ_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "GROQ_API_KEY sozlanmagan. Render Environment Variables bo‘limiga kalit qo‘shing."
      });
    }

    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const language = req.body.language === "en" ? "English" : "Uzbek";
    const safeMessages = messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

    if (!safeMessages.length || !safeMessages.some(m => m.role === "user")) {
      return res.status(400).json({ error: "Avval xabar yozing." });
    }

    const systemMessage = {
      role: "system",
      content: `You are JARVIS ULTRA, a helpful, friendly AI assistant. Reply in ${language}. Keep answers clear and useful. If the user writes in another language, you may follow that language. Never claim to perform actions you cannot actually perform.`
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [systemMessage, ...safeMessages],
        temperature: 0.7,
        max_tokens: 900
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || `Groq API xatosi (${response.status})`;
      return res.status(response.status === 401 ? 502 : response.status).json({ error: message });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return res.status(502).json({ error: "AI javobi bo‘sh qaytdi. Qayta urinib ko‘ring." });
    res.json({ reply });
  } catch (error) {
    console.error("Chat endpoint error:", error.message);
    res.status(500).json({ error: "Serverda xatolik. Bir ozdan keyin qayta urinib ko‘ring." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`JARVIS ULTRA running on port ${PORT}`);
});
