import { fetchWeather } from "./weather.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/api/weather", async (req, res) => {
    try {
        const weather = await fetchWeather();
        res.json(weather);
    } catch (error) {     
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
