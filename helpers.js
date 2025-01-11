export function roundNumber(number) {
    return Math.round(number);
}

export function getCurrentTime() {
    const currentDateTime = new Date().toString();
    const formattedTime = currentDateTime.split('GMT')[0];
    formattedTime.trim();
    return formattedTime;
}

export function convertMillisecondsToTime(milliseconds) {
    const date = new Date(milliseconds * 1000);
    return date.toTimeString().split('GMT')[0];
}

export function firstLetterToUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}