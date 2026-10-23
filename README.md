# JARVIS ULTRA

A simple Uzbek/English AI assistant web app with browser voice input/output, installable PWA support, Express backend, and Groq API integration.

## Deploy to Render from GitHub (Android-friendly)

1. Upload all files in this project folder to a new GitHub repository. Do not upload a real API key.
2. Open https://render.com and sign in.
3. Choose **New + → Web Service**, then connect your GitHub repository.
4. Render should detect `render.yaml`. If asked manually:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
5. In Render's **Environment** section, add:
   - `GROQ_API_KEY` = your secret key from Groq Console
   - `GROQ_MODEL` = `llama-3.3-70b-versatile`
6. Deploy. Open the public URL Render gives you.

## Important

- The Groq key belongs in Render Environment Variables, NOT in GitHub or browser code.
- If the selected model is unavailable for your account, check the models listed in Groq Console and update `GROQ_MODEL`.
- Free hosting and AI API plans can have usage limits and may sleep or throttle.
- Voice input availability depends on browser support and microphone permission. Speech output uses the browser's built-in voices.
- Do not paste your API key into chats or screenshots.

## Run locally (optional)

Install Node.js 18+, then:

```bash
npm install
```

Set `GROQ_API_KEY` in your environment or in a local `.env` file (never commit `.env`), then:

```bash
npm start
```

Open `http://localhost:3000`.
