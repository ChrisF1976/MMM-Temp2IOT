Module.register("MMM-Temp2IOT", {
    defaults: {
        apiUrl: "http://192.168.178.140/api",
        updateInterval: 60000, // Aktualisierung alle 60 Sekunden
        replaceNames: ["Outside", "Shed"], // Benutzerdefinierte Namen für Sensoren
        icons1: [
            { condition: "<0", icon: "twemoji:cold-face" },
            { condition: "<5", icon: "noto:cold-face" },
            { condition: "<15", icon: "fluent-emoji:cold-face" },
            { condition: "<20", icon: "noto:smiling-face-with-sunglasses" },
            { condition: "<25", icon: "noto:grinning-face-with-sweat" },
            { condition: "<30", icon: "noto:hot-face" },
            { condition: "<40", icon: "noto:hot-springs" },
            { condition: "<100", icon: "noto:exploding-head" }
        ],
        icons2: [
            { condition: "<0", icon: "noto:snowflake" },
            { condition: "<10", icon: "noto:cool-button" },
            { condition: "<20", icon: "noto:check-mark-button" },
            { condition: "<30", icon: "noto:fast-up-button" },
            { condition: "<40", icon: "noto:sos-button" },
            { condition: "<100", icon: "noto:exploding-head" }
        ]
    },

    getScripts: function () {
        return ["https://code.iconify.design/3/3.1.1/iconify.min.js"];
    },

    getStyles: function () {
        return ["MMM-Temp2IOT.css"];
    },

    start: function () {
        this.sensors = [];
        this.sendSocketNotification("FETCH_DATA", this.config.apiUrl);
        setInterval(() => {
            this.sendSocketNotification("FETCH_DATA", this.config.apiUrl);
        }, this.config.updateInterval);
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-Temp2IOT";

        if (this.sensors.length === 0) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }

        this.sensors.forEach((sensor, index) => {
            const sensorRow = document.createElement("div");
            sensorRow.className = "sensor-row";

            // Passendes Symbol auswählen
            const selectedIcon = this.getIconForTemperature(sensor.value, index);

            const icon = document.createElement("span");
            icon.className = "iconify";
            icon.setAttribute("data-icon", selectedIcon);

            // Text (Name und Wert)
            const textWrapper = document.createElement("div");

            const name = document.createElement("span");
            name.className = "sensor-name";
            const displayName = this.config.replaceNames[index] || `Sensor ${index + 1}`;
            name.textContent = `${displayName}:`;

            const value = document.createElement("span");
            value.className = "sensor-value";
            value.textContent = ` ${sensor.value.toFixed(2)} °C`;

            textWrapper.appendChild(name);
            textWrapper.appendChild(value);

            // In Zeile einfügen
            sensorRow.appendChild(icon);
            sensorRow.appendChild(textWrapper);
            wrapper.appendChild(sensorRow);
        });

        return wrapper;
    },

    getIconForTemperature: function (temperature, sensorIndex) {
        const iconConfig = sensorIndex === 0 ? this.config.icons1 : this.config.icons2;

        console.log(`Checking icons for Sensor ${sensorIndex}, Temperature: ${temperature}`);

        for (let i = 0; i < iconConfig.length; i++) {
            const { condition, icon } = iconConfig[i];

            if (condition.startsWith("<")) {
                const threshold = parseFloat(condition.slice(1));
                if (temperature < threshold) {
                    console.log(`Selected Icon: ${icon} for Temperature: ${temperature}`);
                    return icon;
                }
            }
        }

        console.log("No matching icon found, using default.");
        return "mdi:thermometer"; // Fallback-Symbol
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "DATA_FETCHED") {
            this.sensors = payload.sensors;
            this.updateDom();
        }
    }
});
