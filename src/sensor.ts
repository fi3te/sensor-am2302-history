import * as os from "os";

let sensor;
if (os.type().toLowerCase() === "linux" && os.arch() === "arm") {
    sensor = require("node-dht-sensor");
    if (!sensor) {
        throw new Error("Module \"node-dht-sensor\" not found!");
    }
}

function sensorRead(sensorType: number, gpioPin: number, callback: (err: Error | undefined, temperature: number, humidity: number) => void): void {
    sensor.read(sensorType, gpioPin, callback);
}

function dummyRead(sensorType: number, gpioPin: number, callback: (err: Error | undefined, temperature: number, humidity: number) => void): void {
    callback(undefined, 20, 50);
}

export const read = sensor ? sensorRead : dummyRead;
