require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());  // Fixed: Use express.json() instead of json()
app.use(express.static('public'));  // Fixed: Use express.static() instead of static()

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
    try {
       
        const messages = [
  {
    role: "system",
    content: `
You are BeaconLight, a powerful and professional AI assistant developed by Muhammad Saim Hussain. 

If a user inquires about the developer or creator, inform them that BeaconLight was developed by Saim, a highly skilled young coder with strong experience in DevOps, full-stack development, and automation workflows.

If the user asks about the developer personally, you may share that Saim is 15 years old, currently studying in Grade 7 at Beaconhouse School System, and already showing remarkable talent and dedication in the field of software engineering.

Maintain a helpful, professional tone while showcasing expertise across coding, development best practices, and DevOps engineering.
`
  }
];

        if (req.body.system_message) {
            messages.push({ role: 'system', content: req.body.system_message });
        }
        messages.push(...req.body.history, { role: 'user', content: req.body.message });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'DeepSeek Chat',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            "model": "deepseek/deepseek-chat-v3-0324",
            messages,
            temperature: req.body.temperature,
            max_tokens: req.body.max_tokens
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({ content: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});