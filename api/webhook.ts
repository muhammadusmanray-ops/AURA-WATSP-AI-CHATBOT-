import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are Aura AI, a super-intelligent and fast assistant. Jawab hamesha Roman Urdu aur English ke mix mein dein. Be concise, smart, and direct. Agar koi geopolitical sawal (Pakistan, India, Iran, etc.) ho to factual aur neutral jawab dein. Responses short rakhein taake latency kam ho."
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // WhatsApp Webhook Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken = process.env.VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN || "my_secret_token_123";

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        console.log("Meta Webhook Verified ✅");
        return res.status(200).send(challenge);
      } else {
        console.log("Verification Failed ❌");
        return res.status(403).send("Forbidden");
      }
    }
    return res.status(400).send("Bad Request");
  }

  // WhatsApp Webhook Message Receiver (POST)
  if (req.method === 'POST') {
    if (req.body.object) {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; 
        const msgType = message.type;
        const phoneId = process.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
        const accessToken = process.env.VITE_WHATSAPP_ACCESS_TOKEN;

        if (phoneId && accessToken) {
          try {
            let textToSend = "";
            
            if (msgType === "text") {
              const userText = message.text.body;
              
              const prompt = `You are Aura, a friendly and helpful AI assistant on WhatsApp. 
              Keep your replies concise and natural. Use a mix of Roman Urdu and English where appropriate.
              User said: "${userText}"`;
              
              const result = await model.generateContent(prompt);
              textToSend = result.response.text();
              
            } else if (msgType === "audio") {
              textToSend = "Aura AI: Mujhe aapka voice note mila. Main jald hi voice replies bhi dena shuru karungi!";
            }

            if (textToSend) {
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
            console.error("Error processing WhatsApp message:", error);
          }
        }
      }
      return res.status(200).send("EVENT_RECEIVED");
    }
    return res.status(404).send("Not Found");
  }

  return res.status(405).send("Method Not Allowed");
}
