/* MagicMirror²
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * Extension helper module to call external resources
 */

const https = require("node:https");
const Log = require("logger");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start: function () {},

  callApi: function (payload) {
    let that = this;
    this.url = payload;
    let success = false;
    Log.info("[MMM-DynamicWeather] Getting Weather API data");

    https
      .get(this.url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          let result = JSON.parse(body);
          if (res.statusCode !== 200) {
            Log.error("[MMM-DynamicWeather] Failed getting API: ", res.statusCode);
          } else {
            Log.info("[MMM-DynamicWeather] Received successful Weather API data");
            success = true;
          }

          that.sendSocketNotification("API-Received", {
            url: that.url,
            result: result,
            success: success,
          });
        });
      })
      .on("error", (error) => {
        Log.error("[MMM-DynamicWeather] Failed getting api: ", error);
      });
  },

  callHoliday: function () {
    let that = this;
    let success = false;
    Log.info("[MMM-DynamicWeather] Getting Holiday data");

    https
      .get("https://www.timeanddate.com/holidays/us/?hol=43122559", (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          if (res.statusCode !== 200) {
            Log.error("[MMM-DynamicWeather] Failed getting holidays: ", res.statusCode);
          } else {
            Log.info("[MMM-DynamicWeather] Received successful Holiday data");
            success = true;
          }

          let result = { holidayBody: body };
          that.sendSocketNotification("Holiday-Received", {
            url: that.url,
            result: result,
            success: success,
          });
        });
      })
      .on("error", (error) => {
        Log.error("[MMM-DynamicWeather] Failed getting holidays: ", error);
      });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Fetch") {
      this.callApi(payload);
    }
    if (notification === "Holiday-Fetch") {
      this.callHoliday();
    }
  },
});
