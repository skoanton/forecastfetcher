import axios from "axios";
import dotenv from "dotenv";
import { roundNumber, getCurrentTime, convertMillisecondsToTime } from "./helpers.js";

dotenv.config();
const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

export async function fetchWeather(city) {
    try {

        const coordinates = await fetchCoordinates(city);
        if (!coordinates) {
            console.log("No city or something went wrong");
            return;
        }
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${API_KEY}&units=metric`);

        if (response.status !== 200) {
            throw new Error('Error fetching data');
        }
        const data = response.data;
        return {
            time: getCurrentTime(),
            main: data.weather[0].main,
            temperature: roundNumber(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            visibility: data.visibility,
            wind: {
                speed: data.wind.speed,
                deg: data.wind.deg
            },
            sunrise: convertMillisecondsToTime(data.sys.sunrise),
            sunset: convertMillisecondsToTime(data.sys.sunset)

        };


    } catch (error) {
        console.error(error);
        return null;

    }
};

async function fetchCoordinates(city) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);

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