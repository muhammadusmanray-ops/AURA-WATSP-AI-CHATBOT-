import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are Aura AI, a super-intelligent and fast assistant. Jawab hamesha Roman Urdu aur English ke mix mein dein. Be concise, smart, and direct. Responses short rakhein taake latency kam ho."
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`Incoming ${req.method} request to Webhook`);

  // 1. WhatsApp Webhook Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken = process.env.VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN || "my_secret_token_123";

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Meta Webhook Handshake Successful ✅");
      // Meta expects a plain text response of the challenge
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(challenge);
    } else {
      console.log("Meta Webhook Handshake Failed ❌ (Token Mismatch)");
      return res.status(403).send("Forbidden");
    }
  }

  // 2. WhatsApp Message Handling (POST)
  if (req.method === 'POST') {
    try {
      const { body } = req;

      if (body.object === 'whatsapp_business_account') {
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (message) {
          const from = message.from;
          const msgType = message.type;
          const phoneId = process.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
          const accessToken = process.env.VITE_WHATSAPP_ACCESS_TOKEN;

          if (phoneId && accessToken && msgType === 'text') {
            const userText = message.text.body;
            
            // Gemini Inference
            const prompt = `User said: "${userText}"`;
            const result = await model.generateContent(prompt);
            const aiReply = result.response.text();

            // Send WhatsApp Reply
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
                text: { body: aiReply },
              }),
            });
            console.log("AI Reply sent to WhatsApp ✅");
          }
        }
        return res.status(200).send('EVENT_RECEIVED');
      }
      return res.status(404).send('Not a WhatsApp Event');
    } catch (err) {
      console.error("Webhook Error:", err);
      return res.status(500).send('Server Error');
    }
  }

  return res.status(405).send("Method Not Allowed");
}
