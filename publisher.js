const mqtt = require("mqtt");

const mockSensorData = require('./mock-sensor-data.json');

const client = mqtt.connect("mqtt://localhost:1883", { username: 'lab', password: 'lab' });

let i = 0;

client.on("connect", () => {
    setInterval(() => {
        console.log(mockSensorData[i]);

        client.publish("sensors", JSON.stringify(mockSensorData[i]));
        i = (i + 1) % mockSensorData.length;
    }, 5000);
});

client.on('error', (err) => {
    console.error(err);
});