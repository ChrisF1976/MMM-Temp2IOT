Module.register("MMM-Temp2IOT", {
    defaults: {
        apiUrl: "http://192.168.178.140/api",
        updateInterval: 60000, // Aktualisierung alle 60 Sekunden
        icons: ["mdi:weather-sunny", "mdi:home-thermometer"], // Symbole in Reihenfolge der Sensoren
        replaceNames: ["Outside", "Shed"] // Benutzerdefinierte Namen
    },

    start: function () {
        this.sensors = [];
        this.sendSocketNotification("FETCH_DATA", this.config.apiUrl);
        setInterval(() => {
            this.sendSocketNotification("FETCH_DATA", this.config.apiUrl);
        }, this.config.updateInterval);
    },

    getStyles: function () {
        return ["MMM-Temp2IOT.css"];
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

            // Symbol
            const icon = document.createElement("span");
            icon.className = "iconify";
            icon.setAttribute("data-icon", this.config.icons[index] || "mdi:thermometer");

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

            // Hinzufügen zur Zeile
            sensorRow.appendChild(icon);
            sensorRow.appendChild(textWrapper);
            wrapper.appendChild(sensorRow);
        });

        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "DATA_FETCHED") {
            this.sensors = payload.sensors;
            this.updateDom();
        }
    }
});
