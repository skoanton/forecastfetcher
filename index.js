
import { Command } from "commander";
import { getForecastCommand, getHistoryCommand } from './commands.js';
const program = new Command();
program.version('0.0.1');


program.command('history')
    .description('Show History')
    .action(async () => {
        await getHistoryCommand();
    });

program.command('forecast <city>')
    .description('Show Forecast for <city>')
    .action(async (city) => {
        await getForecastCommand(city);
    });


program.parse(process.argv);