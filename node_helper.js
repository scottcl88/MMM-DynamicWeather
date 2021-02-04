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
  start: function () {},

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

  callHoliday: function (payload) {
    var that = this;
    var hoilidayName = payload.hoilidayName;
    var holidayDate;
    request({ url: "https://www.timeanddate.com/holidays/us/?hol=43122559", method: "GET" }, function (error, response, body) {
      var children = document.getElementById("holidays-table").children[1].children;
      for (var i = 0; i < children.length; i++) {
        var child1 = children[i];
        if (child1.hasAttribute("data-date")) {
          var child2 = child1.children;
          for (var j = 0; j < child2.length; j++) {
            var child3 = child2[j];
            if (child3.hasChildNodes()) {
              for (var k = 0; k < child3.children.length; k++) {
                var child4 = child3.children[k];
                if (child4.text == hoilidayName) {
                  holidayDate = child1.getAttribute("data-date");
                  break;
                }
              }
            }
            if(holidayDate) break;
          }
        }
        if(holidayDate) break;
      }
      var result = { holidayDate: holidayDate };
      if (error || response.statusCode !== 200) {
        console.error("Failed getting api: ", error, response);
      }

      that.sendSocketNotification("Holiday-Received", {
        url: that.url,
        result: result,
      });
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Fetch") {
      this.callApi(payload);
    }
    if (notification === "Holiday-Fetch") {
      this.callApi(payload);
    }
  },
});
