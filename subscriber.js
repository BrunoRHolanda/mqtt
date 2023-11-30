const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883", { username: 'lab', password: 'lab' });

const air = {
    data: {
        topic: 'air/control',
        compressor: false,
        mode: 'cooling',
        changed: false,
    },
    turnOnCooling() {
        if (!this.data.compressor) {
            this.data.compressor = true;
            this.data.changed = true;
        }

        if (this.data.mode !== 'cooling') {
            this.data.mode = 'cooling';
            this.data.changed = true;
        }
    },

    turnOnHeating() {
        if (!this.data.compressor) {
            this.data.compressor = true;
            this.data.changed = true;
        }

        if (this.data.mode !== 'cooling') {
            this.data.mode = 'heating';
            this.data.changed = true;
        }
    },

    turnOff() {
        if (this.data.compressor) {
            this.data.compressor = false;
            this.data.changed = true;
            this.data.mode = 'standby';
        }
    },

    reset() {
        this.data.changed = false;
    },

    isChanged() {
        return this.data.changed;
    }
};

const humidifier = {
    data: {
        topic: 'humidifier/control',
        compressor: false,
        changed: false,
    },
    turnOn() {
        if (!this.data.compressor) {
            this.data.compressor = true;
            this.data.changed = true;
        }
    },

    turnOff() {
        if (this.data.compressor) {
            this.data.compressor = false;
            this.data.changed = true;
        }
    },

    reset() {
        this.data.changed = false;
    },

    isChanged() {
        return this.data.changed;
    }
};

const hairdryer = {
    data: {
        topic: 'hairdryer/control',
        compressor: false,
        changed: false,
    },
    turnOn() {
        if (!this.data.compressor) {
            this.data.compressor = true;
            this.data.changed = true;
        }
    },

    turnOff() {
        if (this.data.compressor) {
            this.data.compressor = false;
            this.data.changed = true;
        }
    },

    reset() {
        this.data.changed = false;
    },

    isChanged() {
        return this.data.changed;
    }
};

const control = ({ temperature, humidity }) => {
    if (temperature > 27.0) {
        air.turnOnCooling();
    } else if (temperature < 18.0) {
        air.turnOnHeating();
    } else {
        air.turnOff();
    }

    if (humidity < 40) {
        humidifier.turnOn();
    } else if (humidity >= 40 && humidity <= 55) {
        humidifier.turnOff();
    }

    if (humidity > 55) {
        hairdryer.turnOn();
    } else {
        hairdryer.turnOff();
    }

    if (air.isChanged()) {
        console.log(air.data);
        client.publish(air.data.topic, JSON.stringify(air.data));
        air.reset();
    }

    if (humidifier.isChanged()) {
        console.log(humidifier.data);
        client.publish(humidifier.data.topic, JSON.stringify(humidifier.data));
        humidifier.reset();
    }

    if (hairdryer.isChanged()) {
        console.log(hairdryer.data);
        client.publish(hairdryer.data.topic, JSON.stringify(hairdryer.data));
        hairdryer.reset();
    }
}

client.on("connect", () => {
    client.subscribe("sensors", (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('message', (topic, message) => {
    switch (topic) {
        case 'sensors':
            control(JSON.parse(message.toString()));
            break;
        default:
            console.log(topic);
            console.log(JSON.parse(message.toString()));
            break;
    }
});

client.on('error', (err) => {
    console.error(err);
});
