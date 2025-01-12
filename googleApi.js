import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import process from 'process';
import path from 'path';
import fs from 'fs/promises';
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    try {
        await fs.writeFile(TOKEN_PATH, payload);
    }
    catch (err) {
        console.error(`Failed to write token.json: ${err.message}`);
    }
}


async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

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
    authorize().then((auth) => importValues(auth, forecast)).catch(console.error);

}