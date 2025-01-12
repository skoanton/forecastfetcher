import { fetchWeather } from "./weather.js";
import { pushToGoogleSheets } from "./googleApi.js";
import inquirer from "inquirer";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

async function askQuestion() {
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: "confirm",
                name: "run",
                message: "Do you want to run the script now?",
                default: false,
            }
        ]);

        if (answers.run) {
            await main();
        } else {
            console.log("Exiting the script");
            process.exit(0);
        }
    }
}

if (process.env.NODE_ENV === "development") {
    console.log("Running in development mode");
    askQuestion();
}

else if (process.env.NODE_ENV === "production") {
    console.log("Running in production mode");
    cron.schedule('* 12 * * *', () => {
        console.log('Starting cron job');
        main();
    });
}
else {
    console.error("NODE_ENV is not set or is invalid. Please set NODE_ENV to 'development' or 'production'.");
    process.exit(1);
}

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