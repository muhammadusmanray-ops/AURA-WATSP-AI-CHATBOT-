import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are Aura AI, a super-intelligent and fast assistant. Jawab hamesha Roman Urdu aur English ke mix mein dein. Be concise, smart, and direct. Responses short rakhein taake latency kam ho. Aap Telegram par user ki help kar rahe hain."
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { message } = req.body;

    if (message && message.text) {
      const chatId = message.chat.id;
      const userText = message.text;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      if (!botToken) {
        console.error("TELEGRAM_BOT_TOKEN is missing");
        return res.status(500).send("Bot Token Missing");
      }

      // Gemini Inference
      const prompt = `User said: "${userText}"`;
      const result = await model.generateContent(prompt);
      const aiReply = result.response.text();

      // Send Reply to Telegram
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: aiReply,
        }),
      });

      console.log(`AI Reply sent to Telegram Chat ID: ${chatId} ✅`);
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error("Telegram Webhook Error:", err);
    return res.status(500).send('Server Error');
  }
}
