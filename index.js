import { fetchWeather } from "./weather.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/api/weather", async (req, res) => {

    const authKey = req.headers['authorization'];
    console.log(authKey);
    console.log("API_KEY",process.env.API_KEY);
    if(!authKey){
        return res.status(401).json({error: "Unauthorized"});
    }

    if (authKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Unauthorized" });
    }

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
