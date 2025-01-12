import axios from "axios";
import dotenv from "dotenv";
import { roundNumber, getCurrentTime, convertMillisecondsToTime, firstLetterToUpperCase } from "./helpers.js";

dotenv.config();
const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const CITY = process.env.CITY;
const UNITS = process.env.UNITS;

export async function fetchWeather() {
    try {

        const coordinates = await fetchCoordinates();
        if (!coordinates) {
            console.log("No city or something went wrong");
            return;
        }
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${API_KEY}&units=${UNITS}`);

        if (response.status !== 200) {
            throw new Error('Error fetching data');
        }
        const data = response.data;

        return {
            time: getCurrentTime(),
            main: data.weather[0].main,
            temperature: roundNumber(data.main.temp) + (UNITS === "metric" ? "°C" : "°F"),
            description: firstLetterToUpperCase(data.weather[0].description),
            humidity: data.main.humidity + "%",
            visibility: data.visibility / 1000 + (UNITS === "metric" ? " km" : " miles"),
            wind: {
                speed: data.wind.speed + (UNITS === "metric" ? " m/s" : " mph"),
                deg: data.wind.deg + "°"
            },
            sunrise: convertMillisecondsToTime(data.sys.sunrise),
            sunset: convertMillisecondsToTime(data.sys.sunset)
        };


    } catch (error) {
        console.error(error);
        return null;

    }
};

async function fetchCoordinates() {
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${CITY}&appid=${API_KEY}`);

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const data = response.data[0];
        return {
            latitude: data.lat,
            longitude: data.lon
        };

    } catch (error) {
        console.error(error);
        return null;
    }
}