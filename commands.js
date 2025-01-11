import { fetchWeather } from './weather.js';
import { saveHistory } from './helpers.js';
import fs from 'fs';
export async function getForecastCommand(city) {
    const weather = await fetchWeather(city);
    await saveHistory(city, weather);
    console.log("It's ", weather.temperature, "°C in ", city, " with ", weather.description);

}


export async function getHistoryCommand() {
    const history = JSON.parse(fs.readFileSync('history.json', 'utf8'));
    const sortedHistory = history.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
    });
    sortedHistory.map((forecast, index) => {
        console.log(index + 1 + ". " + forecast.city, forecast.temperature, forecast.description, forecast.time);
    });
}