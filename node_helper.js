const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-Temp2IOT helper started...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_DATA") {
            this.fetchData(payload);
        }
    },

    fetchData: async function (apiUrl) {
        try {
            const response = await axios.get(apiUrl);
            const sensors = response.data.sensors.map(sensor => ({
                name: sensor.name, // Name from API (optional, not used in UI)
                value: sensor.value
            }));
            this.sendSocketNotification("DATA_FETCHED", { sensors });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
});