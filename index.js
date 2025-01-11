import { fetchWeather } from "./weather.js";
import { pushToGoogleSheets } from "./googleApi.js";
import cron from "node-cron";

cron.schedule('0 12 * * *', () => {
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
        await pushToGoogleSheets(forecast);
    }
    catch (error) {
        console.error("Error in main function:", error.message)
    }

}