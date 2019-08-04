import * as cron from 'node-cron';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

export const FILE_EXTENSION = '.txt';
export const CONTENT_TYPE = 'text/plain';

let stream: fs.WriteStream;
let currentFilePath: string;

export function getFileName(): string {
    return moment().format('YYYY-MM-DD') + FILE_EXTENSION;
}

function getFilePath(): string {
    return path.join(__dirname, '..', 'data', getFileName());
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

// runs every minute
const cronExpression = '* * * * *';

export function startDataCollector() {
    cron.schedule(cronExpression, () => {
        const filePath = getFilePath();
        if (currentFilePath !== filePath) {
            openNewWriteStream(filePath);
        }

        // TODO demo
        stream.write(new Date().toISOString() + '\n');
    });
}
