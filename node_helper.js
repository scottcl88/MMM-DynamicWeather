/* Magic Mirror Module: MMM-Weather-Now helper
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Weather-Now helper, started...');

        // Set up the local values
        this.nowIcon = '';
        this.nowWeather = '';
        this.nowTemp = '';
        },


    getWeatherData: function(payload) {

        var that = this;
        this.url = payload;

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                // Let's get the weather data for right now
                that.nowIcon = result.data[0].weather.icon;
                that.nowWeather = result.data[0].weather.description;
                that.nowTemp = result.data[0].app_temp;
            } else {
                // In all other cases it's some other error
                that.nowIcon = 'blank';
                that.nowWeather = 'Error getting data';
                that.nowTemp = '--';
                }

            // We have the response figured out so lets fire off the notifiction
            that.sendSocketNotification('GOT-WEATHER-NOW', {'url': that.url, 'nowIcon': that.nowIcon, 'nowWeather': that.nowWeather, 'nowTemp': that.nowTemp});
            });
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-WEATHER-NOW') {
            this.getWeatherData(payload);
            }
        }

    });