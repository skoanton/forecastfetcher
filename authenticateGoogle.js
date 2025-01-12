import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import process from 'process';
import path from 'path';
import fs from 'fs/promises';
import dotenv from "dotenv";

dotenv.config();
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

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        console.error(`Failed to load saved credentials: ${err.message}`);
        return null;
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
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    } catch (error) {
        console.error(`Error in saveCredentials: ${err.message}`);
        return null;

    }

}

export async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        credentials: CREDENTIALS,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}