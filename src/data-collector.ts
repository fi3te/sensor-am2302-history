import * as fs from "fs";
import moment from "moment";
import * as cron from "node-cron";
import * as path from "path";
import { read } from "./sensor";

// runs every minute
const CRON_EXPRESSION = "* * * * *";
export const DATA_DIRECTORY = path.join(__dirname, "..", "data");
export const FILE_EXTENSION = ".txt";
export const CONTENT_TYPE = "text/plain; charset=utf-8";

let stream: fs.WriteStream;
let currentFilePath: string;

export function getFileName(): string {
    return moment().format("YYYY-MM-DD") + FILE_EXTENSION;
}

function getFilePath(): string {
    return path.join(DATA_DIRECTORY, getFileName());
}

function openNewWriteStream(newFilePath: string): void {
    if (stream) {
        stream.end();
    }
    stream = fs.createWriteStream(newFilePath, {
        flags: "a"
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

        read((err: Error | undefined, temperature: number, humidity: number) => {
            if (!err) {
                const time = moment().format("HH:mm:ss");
                stream.write(`${time} temperature: ${temperature.toFixed(2)}°C, humidity: ${humidity.toFixed(2)}%\n`);
            }
        });
    });
}
