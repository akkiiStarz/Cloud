import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const WHATSAPP_ACCESS_TOKEN = "EAAiwrVcypNIBPBhj6BJmIcn3V5QlPgl15JiD9ldBUozMaZAKEqHvOLdTZBTVbOa625YKW2arZCK3kZAekhQoedLjML0ZBkWQhJeKl5ZA6BwvaO3elGKG0ZBfTVkHZCKyBcF2XH2D7jvMD6VpzrtVtqupHtwXExAaaNZBSInQVsijI9ZAQohMszLWyjQEiSsJn6OAZDZD";
const PHONE_NUMBER_ID = "633196263202996";
const TEMPLATE_NAME = "property";
const LANGUAGE_CODE = "en";

app.post("/", async (req, res) => {
  try {
    const { recipient_number } = req.body;
    if (!recipient_number) return res.status(400).json({ error: "recipient_number is required" });

    const apiUrl = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: recipient_number,
      type: "template",
      template: {
        name: TEMPLATE_NAME,
        language: { code: LANGUAGE_CODE },
        components: [
          {
            type: "header",
            parameters: [{ type: "image", image: { id: "833661429055330" } }],
          },
          { type: "body", parameters: [] },
        ],
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error) {
      console.error("❌ WhatsApp API error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    console.log(`✅ Message sent to ${recipient_number}`);
    res.json({ success: true, data });
  } catch (err) {
    console.error("🚫 Cloud Run error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 WhatsApp sender running on port ${PORT}`));
