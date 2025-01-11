# Forecast App

A simple yet powerful Node.js application that logs daily weather data at 12:00 PM and uploads it to Google Sheets for tracking and analysis.

## Features

- Fetches weather data for a specified city using an external API.
- Logs the weather data daily at a fixed time (12:00 PM) using `node-cron`.
- Uploads the collected weather data to Google Sheets.
- Easy-to-configure environment variables for customization.

## Prerequisites

Before running the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/)
- A Google Cloud Project with Google Sheets API enabled
- Access to the OpenWeather API (or another weather API of your choice)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:skoanton/forecastfetcher.git
   cd forecastfetcher
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the project root and add the following variables:

   ```env
   OPEN_WEATHER_MAP_API_KEY=<your-weather-api-key>
   SPREADSHEET_ID=<your-google-sheet-id>
   SHEET_NAME=<your-google-sheet-name>
   CITY=<your-city-name>
   UNITS=<metric-or-imperial>
   ```

   - `OPEN_WEATHER_MAP_API_KEY`: Your API key for the weather service.
   - `SPREADSHEET_ID`: The ID of your Google Sheet.
   - `SHEET_NAME`: The name of the specific sheet inside your Google Sheet.
   - `CITY`: The name of the city for which you want to fetch the weather data.
   - `UNITS`: Use `metric` for Celsius or `imperial` for Fahrenheit.

4. Set up Google Sheets API:

   - Enable Google Sheets API in your Google Cloud Project.
   - Download the `credentials.json` file and place it in the project root.

## Usage

1. Start the application:

   ```bash
   npm start
   ```

2. To run the app in the background using `pm2`:

   ```bash
   pm2 start index.js --name forecast-app
   ```

3. View logs:

   ```bash
   pm2 logs forecast-app
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
- [pm2](https://pm2.keymetrics.io/) for process management
