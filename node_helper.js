/* Magic Mirror
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * Extension helper module to call an API
 */

var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
  start: function () {
    this.weatherCode = "";
  },

  callApi: function (payload) {
    var that = this;
    this.url = payload;

    request({ url: this.url, method: "GET" }, function (error, response, body) {
      var result = JSON.parse(body);
      if (error || response.statusCode !== 200) {
        console.error("Failed getting api: ", error, response);
      }

      that.sendSocketNotification("API-Received", {
        url: that.url,
        result: result,
      });
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Fetch") {
      this.callApi(payload);
    }
  },
});
