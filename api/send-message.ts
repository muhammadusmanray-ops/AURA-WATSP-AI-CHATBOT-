import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, text } = req.body;
  const phoneId = process.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.VITE_WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !accessToken) {
    return res.status(500).json({ error: 'WhatsApp credentials not configured' });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send message');
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: error.message });
  }
}
