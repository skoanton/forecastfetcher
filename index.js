import { fetchWeather } from "./weather.js";
import { pushToGoogleSheets } from "./googleApi.js";
import cron from "node-cron";

cron.schedule('0/ 1 * * * *', () => {
    console.log('Starting cron job');
    main();
});

async function main() {
    try {
        const forecast = await fetchWeather();
        if (!forecast) {
            console.log("No forecast available");
            return;
        }
        console.log("Forecast fetched successfully");
        await pushToGoogleSheets(forecast);
    }
    catch (error) {
        console.error("Error in main function:", error.message)
    }

}