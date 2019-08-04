import * as cron from 'node-cron';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import * as sensor from 'node-dht-sensor';

const SENSOR_TYPE = 22;
const PIN = 2;
// runs every minute
const CRON_EXPRESSION = '* * * * *';
export const DATA_DIRECTORY = path.join(__dirname, '..', 'data');
export const FILE_EXTENSION = '.txt';
export const CONTENT_TYPE = 'text/plain';

let stream: fs.WriteStream;
let currentFilePath: string;

export function getFileName(): string {
    return moment().format('YYYY-MM-DD') + FILE_EXTENSION;
}

function getFilePath(): string {
    return path.join(DATA_DIRECTORY, getFileName());
}

function openNewWriteStream(newFilePath: string): void {
    if (stream) {
        stream.end();
    }
    stream = fs.createWriteStream(newFilePath, {
        flags: 'a'
    });
    currentFilePath = newFilePath;
}

export function startDataCollector() {
    cron.schedule(CRON_EXPRESSION, () => {
        const filePath = getFilePath();
        if (currentFilePath !== filePath) {
            if (!fs.existsSync(DATA_DIRECTORY)) {
                fs.mkdirSync(DATA_DIRECTORY);
            }
            openNewWriteStream(filePath);
        }

        sensor.read(SENSOR_TYPE, PIN, (err: any, temperature: number, humidity: number) => {
            if (!err) {
                stream.write(`temperature: ${temperature}°C, humidity: ${humidity}%\n`);
            }
        });
    });
}
