# sensor-am2302-history

The application sensor-am2302-history records temperature and humidity data using a compatible DHT sensor like the AM2302 sensor connected to the Raspberry Pi. It provides an HTTP interface via which the recorded data can be queried.

## Usage

1. Update the `application.env` file to your needs:
   - `SENSOR_TYPE`: Use the value '11' for a DHT11 sensor and the value '22' for a DHT22 or AM2302 sensor.
   - `GPIO_PIN`: Specify the [GPIO pin](https://www.raspberrypi.org/documentation/usage/gpio/) the sensor is connected to.
   - `CRON_EXPRESSION`: Use an expression in the crontab syntax to specify the measurement interval.
   - `TZ`: Specify a local time zone that is used for timestamp creation.
2. Update the port mapping or bind mount if necessary.
3. Start the application using docker compose (recommended)
   ```
   docker compose up -d
   ```
   or build and run the app without docker.
   ```
   npm run build
   npm run start
   ```
4. By default, measurements will be written to files in the `./data` directory and can be accessed via one of the following links.
   ```
   http://localhost:4000
   http://localhost:4000/api
   http://localhost:4000/2020-12-31
   ```

(Tested on a Raspberry Pi 2 Model B using an AM2302 sensor)
