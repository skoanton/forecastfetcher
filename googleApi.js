import process from 'process';
import dotenv from "dotenv";
import axios from 'axios';
import { authorize } from './authenticateGoogle.js';
dotenv.config();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

async function importValues(auth, forecast) {
    const range = `${SHEET_NAME}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW`;
    try {
        const { token } = await auth.getAccessToken();
        const response = await axios.post(
            url,
            {
                values: [
                    [forecast.time, forecast.main, forecast.temperature, forecast.description, forecast.humidity, forecast.visibility, forecast.wind.speed, forecast.wind.deg, forecast.sunrise, forecast.sunset]
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        console.log(response.data);
        console.log('Data pushed to Google Sheets');
    } catch (error) {
        console.error(error);
    }
}

export async function pushToGoogleSheets(forecast) {
    try {
        const auth = await authorize();
        await importValues(auth, forecast);
    } catch (err) {
        console.error(err);
    }
}
