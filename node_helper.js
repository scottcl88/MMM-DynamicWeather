/* Magic Mirror
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * Extension helper module to call external resources
 */

var NodeHelper = require("node_helper");
var request = require("request");
module.exports = NodeHelper.create({
  start: function () {},

  callApi: function (payload) {
    var that = this;
    this.url = payload;
    var success = false;

    request({ url: this.url, method: "GET" }, function (error, response, body) {
      var result = JSON.parse(body);
      if (error || response.statusCode !== 200) {
        console.error("Failed getting api: ", error, response);
      } else {
        success = true;
      }

      that.sendSocketNotification("API-Received", {
        url: that.url,
        result: result,
        success: success,
      });
    });
  },

  callHoliday: function () {
    var that = this;
    var success = false;
    request({ url: "https://www.timeanddate.com/holidays/us/?hol=43122559", method: "GET" }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error("Failed getting holidays: ", error, response);
      } else {
        success = true;
      }
      var result = { holidayBody: body };
      that.sendSocketNotification("Holiday-Received", {
        url: that.url,
        result: result,
        success: success,
      });
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
