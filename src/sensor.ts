import * as os from "os";

let sensor;
if (os.type().toLowerCase() === 'linux' && os.arch() === 'arm') {
    sensor = require('node-dht-sensor');
    if (!sensor) {
        throw new Error('Module "node-dht-sensor" not found!');
    }
}

const SENSOR_TYPE = 22;
const PIN = 2;

function sensorRead(callback: (err: any, temperature: number, humidity: number) => void): void {
    sensor.read(SENSOR_TYPE, PIN, callback);
}

function dummyRead(callback: (err: any, temperature: number, humidity: number) => void): void {
    callback(undefined, 20, 50);
}

export const read = sensor ? sensorRead : dummyRead;
