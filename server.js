
import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/breeds", async (req, res) => {
  try {
    const apiKey = process.env.CAT_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "CAT_API_KEY não configurada no arquivo .env",
      });
    }

    const response = await fetch(
      "https://api.thecatapi.com/v1/breeds",
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro ao consultar The Cat API",
      });
    }

    const breeds = await response.json();
    return res.json(breeds);
  } catch (error) {
    console.error("Erro ao consultar raças:", error);

    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor da Cat API: http://localhost:${PORT}`);
});
