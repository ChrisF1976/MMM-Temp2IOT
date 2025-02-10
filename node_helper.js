const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-Temp2IOT helper started...");
        // Initialize a flag to prevent continuous retries
        this.cooldown = false;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_DATA") {
            this.fetchData(payload);
        }
    },

    fetchData: async function (apiUrl) {
        // Skip fetching if we're in cooldown mode.
        if (this.cooldown) {
            return;
        }

        try {
            const response = await axios.get(apiUrl);
            const sensors = response.data.sensors.map(sensor => ({
                name: sensor.name, // Name from API (optional, not used in UI)
                value: sensor.value
            }));
            this.sendSocketNotification("DATA_FETCHED", { sensors });
        } catch (error) {
            console.error("Error fetching data:", error.message);

            // Activate cooldown to avoid continuous error logging
            this.cooldown = true;

            // Set a timeout (e.g., 30 seconds) before reattempting the connection.
            setTimeout(() => {
                this.cooldown = false;
                console.log("Retrying connection...");
            }, 30000); // 30000 milliseconds = 30 seconds
        }
    }
});
