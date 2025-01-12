# Forecast App

A robust Node.js application that logs daily weather data and uploads it to Google Sheets for tracking and analysis.

## Features

- Fetches weather data for a specified city using an external API.
- Logs weather data daily at a scheduled time (12:00 PM) using `node-cron`.
- Uploads collected weather data to Google Sheets.
- Flexible configuration via environment variables.
- Supports running in Docker with timezone synchronization and persistent data storage.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/)
- A Google Cloud project with Google Sheets API enabled
- An API key for OpenWeather
- [Docker](https://www.docker.com/) (for containerization)

## Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:skoanton/forecastfetcher.git
   cd forecastfetcher
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project root and add the following variables:

   ```env
   OPEN_WEATHER_MAP_API_KEY=<your-api-key>
   SPREADSHEET_ID=<your-google-sheet-id>
   SHEET_NAME=<your-google-sheet-name>
   CITY=<your-city-name>
   UNITS=<metric/imperial>
   NODE_ENV=production
   PROJECT_ID=<your-project-id>
   PRIVATE_KEY_ID=<your-private-key-id>
   PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...END PRIVATE KEY-----\n"
   CLIENT_EMAIL=<your-service-account-email>
   CLIENT_ID=<your-client-id>
   AUTH_URI=https://accounts.google.com/o/oauth2/auth
   TOKEN_URI=https://oauth2.googleapis.com/token
   AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/<your-service-account-email>
   ```

   - `OPEN_WEATHER_MAP_API_KEY`: Your API key for the weather service.
   - `SPREADSHEET_ID`: The ID of your Google Sheet.
   - `SHEET_NAME`: The name of the specific sheet inside your Google Sheet.
   - `CITY`: The name of the city for which you want to fetch the weather data.
   - `UNITS`: Use `metric` for Celsius or `imperial` for Fahrenheit.
   - `NODE_ENV`: Set to `production` for deployment.
   - Other variables represent your service account credentials for Google Sheets API authentication.

4. **Set up Google Sheets API:**

   - Enable the Google Sheets API in your Google Cloud Project.
   - Download the `service-account-key.json` file from your Google Cloud Project.
   - Ensure the service account email has Editor permissions on your Google Sheet.
   - Update .env accordingly.

## Usage

### Running Locally

1. **Start the application:**

   ```bash
   node index.js
   ```

### Running with Docker Compose

1. **Update the timezone in the Dockerfile (optional):**

   To ensure the correct timezone is set in the Docker container, you can update your `Dockerfile` as follows:

   ```dockerfile
   # Set the timezone (e.g., Europe/Stockholm)
   ENV TZ=Europe/Stockholm
   ```

   Rebuild the Docker image after making this change to apply the updated timezone:

   ```bash
   docker-compose build
   ```

2. **Start the application using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Stop the application:**
   Press `Ctrl+C` in the terminal where Docker Compose is running, or stop it using:

   ```bash
   docker-compose down
   ```

4. **View logs:**
   Logs will be visible in the terminal where `docker-compose up` is running, or you can check logs for a specific container:
   ```bash
   docker-compose logs app
   ```

## How It Works

1. The app uses `node-cron` to schedule a task that runs daily at 12:00 PM.
2. The task fetches weather data for the specified city using the weather API.
3. The fetched data is structured and uploaded to Google Sheets using the Google Sheets API.

## Technologies Used

- **Node.js**: Runtime for executing JavaScript server-side.
- **Axios**: For making HTTP requests to the weather API.
- **node-cron**: For scheduling the daily weather data collection.
- **Google APIs**: For uploading data to Google Sheets.
- **Docker**: For containerization and easy deployment.

## Example Output

A row of weather data might look like this in Google Sheets:

| Time                  | Main   | Temperature | Description | Humidity | Visibility | Wind Speed  | Wind Direction | Sunrise   | Sunset   |
|-----------------------|--------|-------------|-------------|----------|------------|-------------|----------------|-----------|----------|
| Sun Jan 12 2025 12:00 | Clouds | 2°C         | Few clouds  | 90%      | 10 km      | 6.32 m/s    | 6°             | 08:49:01  | 15:41:09 |

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenWeather API](https://openweathermap.org/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Docker](https://www.docker.com/) for containerization
