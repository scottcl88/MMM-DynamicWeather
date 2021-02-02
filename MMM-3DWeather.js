/* Magic Mirror
 * Module: MMM-3DWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-3DWeather
 * MIT Licensed.
 *
 * A simple module to display different images based on current weather
 */
var jquery = require('jquery');
var $ = jquery.create();

Module.register("MMM-3DWeather", {
  defaults: {
    flakeCount: 100,
    theme: "winter",
    api_key: "c5cf8af3d17140838bfcec85c2467d3b",
    lat: 39.822948,
    lon: -84.017937,
    interval: 13500000, // Every 1 hour
  },

  start: function () {
    this.units = this.config.units;
    this.loaded = false;
    this.url =
      "https://api.weatherbit.io/v2.0/current?key=" +
      this.config.api_key +
      "&lat=" +
      this.config.lat +
      "&lon=" +
      this.config.lon
    this.weatherCode = "";

    // Trigger the first request
    this.getWeatherAPI(this);
  },

  themes: {
    winter: {
      flakePrefix: "snow", // prefix of css name, e.g. snow1
      imagesCount: 3, // number of images available in this theme, here:  snow1, snow2, snow3
      downwards: true, // direction of flake movements, snow goes downwards
      sizeFactor: 1,
    }, // adapt size of flakes to your liking, use original flake size
    love: {
      flakePrefix: "heart", // prefix of css name, e.g. heart1
      imagesCount: 2, // number of images in this theme, here:  heart1, heart2
      downwards: false, // direction of flake movements, hearts raise upwards
      sizeFactor: 2,
    }, // adapt size of flakes to your liking, we like bigger hearts
    water: {
      flakePrefix: "bubble", // prefix of css name, e.g. bubble1
      imagesCount: 1, // number of images in this theme, here:  bubble1
      downwards: false, // direction of flake movements, bubbles raise upwards
      sizeFactor: 2,
    }, // adapt size of flakes to your liking, we like bigger bubbles
  },

  getStyles: function () {
    return ["MMM-3DWeather.css"];
  },

  getDom: function () {
    // var themeSettings = this.themes[this.config.theme];
    var theme = "water";
    if (this.weatherCode == "802") {
      theme = "winter";
    } else if (this.weatherCode == "800") {
      theme = "love";
	}
	
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";

	this.showSnow(wrapper, theme);
    
    return wrapper;
  },
  
  showSnow: function(wrapper, theme){
	var themeSettings = this.themes[theme];
	var flake, jiggle, size;

    for (var i = 0; i < this.config.flakeCount; i++) {
      size = themeSettings.sizeFactor * (Math.random() * 0.75) + 0.25;
      let flakeImage = document.createElement("div");

      var flakeSuffix = Math.round(
        1 + Math.random() * (themeSettings.imagesCount - 1)
      );
      flakeImage.className = themeSettings.flakePrefix + flakeSuffix;
      flakeImage.style.transform = "scale(" + size + ", " + size + ")";
      flakeImage.style.opacity = size;

      flake = document.createElement("div");
      if (themeSettings.downwards) {
        flake.className = "flake-downwards";
      } else {
        flake.className = "flake-upwards";
      }

      jiggle = document.createElement("div");
      jiggle.style.animationDelay = Math.random() * 4 + "s";
      jiggle.style.animationDuration = Math.random() * 30 + 30 + "s";
      jiggle.appendChild(flakeImage);

      size = Math.random() * 0.75 + 0.25;
      jiggle.style.transform = "scale(" + size + ", " + size + ")";
      jiggle.style.opacity = size;

      flake.appendChild(jiggle);
      flake.style.left = Math.random() * 100 - 10 + "%";
      flake.style.animationDelay = Math.random() * 100 + "s";
      flake.style.animationDuration = 100 - Math.random() * 50 * size + "s";

      wrapper.appendChild(flake);
    }
  },

  getWeatherAPI: function (_this) {
    _this.sendSocketNotification("API-Fetch", _this.url);
    setTimeout(_this.getWeatherData, _this.config.interval, _this);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Received" && payload.url === this.url) {
	  this.loaded = true;
	  
	  this.weatherCode = payload.result.data[0].weather.code;
    //   this.weatherCode = payload.weatherCode;
      this.updateDom(1000);
    }
  },
});
