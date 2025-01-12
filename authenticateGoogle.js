import { google } from 'googleapis';
import process from 'process';
import path from 'path';
import fs from 'fs/promises';
import dotenv from "dotenv";
import http from "http";

dotenv.config();
const DATA_DIR = path.join(process.cwd(), "data");
const TOKEN_PATH = path.join(process.cwd(), 'data', 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


const CREDENTIALS = {
    installed: {
        client_id: process.env.CLIENT_ID,
        project_id: process.env.PROJECT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uris: [process.env.REDIRECT_URIS],
    }
}

async function ensureDataDirExists() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error(`Failed to create data directory: ${error.message}`);
    }
}

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        console.error(`Failed to load saved credentials: ${err.message}`);
    }
}

async function saveCredentials(client) {
    try {
        const keys = CREDENTIALS;
        const key = keys.installed || keys.web;

        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    } catch (error) {
        console.error(`Error in saveCredentials: ${error.message}`);
        return null;

    }

}

export async function authorize() {
    await ensureDataDirExists();
    const { client_id, client_secret, redirect_uris } = CREDENTIALS.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = await loadSavedCredentialsIfExist();
    if (token) {
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    }

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES,
    });

    console.log(`Authorize this app by visiting this URL:\n${authUrl}`);

    const code = await new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const code = url.searchParams.get("code");
            if (code) {
                res.end("Authentication successful! You can close this tab.");
                server.close();
                resolve(code);
            }
        }).listen(80);
    });
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await saveCredentials(tokens);

    console.log("Authentication successful!");
    return oAuth2Client;
}