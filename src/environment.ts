import * as dotenv from "dotenv";

export interface Env extends NodeJS.ProcessEnv {
    SENSOR_TYPE: "11" | "22";
    GPIO_PIN: string;
    CRON_EXPRESSION: string;
}

export function loadEnv(): Env {
    dotenv.config({path: "application.env"});
    return process.env as Env;
}
