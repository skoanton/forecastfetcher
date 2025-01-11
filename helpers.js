import fs from 'fs';
export function roundNumber(number) {
    return Math.round(number);
}

export async function saveHistory(city, weather) {
    const currentDateTime = new Date().toString();
    const formattedTime = currentDateTime.split('GMT')[0];
    const history = JSON.parse(fs.readFileSync('history.json', 'utf8'));
    if (!history) {
        fs.writeFileSync('history.json', JSON.stringify([]));
    }
    history.push({
        city: city,
        temperature: weather.temperature,
        description: weather.description,
        time: formattedTime
    });
    fs.writeFileSync('history.json', JSON.stringify(history));
}