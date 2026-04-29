import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON
  app.use(express.json());

  // WhatsApp Webhook Verification (GET)
  app.get("/api/whatsapp/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken = process.env.VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN || "my_secret_token_123";

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        console.log("Meta Webhook Verified ✅");
        res.status(200).send(challenge);
      } else {
        console.log("Verification Failed ❌");
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  });

  // WhatsApp Webhook Message Receiver (POST)
  app.post("/api/whatsapp/webhook", async (req, res) => {
    if (req.body.object) {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; // User's phone number
        const msgType = message.type;
        const phoneId = process.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
        const accessToken = process.env.VITE_WHATSAPP_ACCESS_TOKEN;

        console.log(`Received ${msgType} from ${from}`);

        if (phoneId && accessToken) {
          try {
            let textToSend = "";
            
            if (msgType === "text") {
              const userText = message.text.body;
              console.log(`Processing text with Gemini: ${userText}`);
              
              // Call Gemini for response
              const prompt = `You are Aura, a friendly and helpful AI assistant on WhatsApp. 
              Keep your replies concise and natural. Use a mix of Roman Urdu and English where appropriate.
              User said: "${userText}"`;
              
              const result = await model.generateContent(prompt);
              textToSend = result.response.text();
              
            } else if (msgType === "audio") {
              // For now, simple reply for audio. 
              // To fix properly: download media from Meta using message.audio.id
              textToSend = "Aura AI: Mujhe aapka voice note mila. Main jald hi voice replies bhi dena shuru karungi! (Media API setup in progress)";
            }

            if (textToSend) {
              // Send reply via Meta Graph API
              await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: { body: textToSend },
                }),
              });
              console.log("Gemini reply sent successfully ✅");
            }
          } catch (error) {
            console.error("Error processing WhatsApp message with Gemini:", error);
          }
        }
      }
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
