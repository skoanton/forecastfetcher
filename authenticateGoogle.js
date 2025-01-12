import { google } from 'googleapis';
import process from 'process';
import dotenv from "dotenv";

dotenv.config();
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const CREDENTIALS = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

export async function authorize() {
    if (!CREDENTIALS) {
        console.error("Error: No credentials found.");
        return;
    }
    const auth = new google.auth.GoogleAuth({
        credentials: CREDENTIALS,
        scopes: SCOPES,
    });

    console.log("Service account authenticated successfully.");
    return auth.getClient();
}