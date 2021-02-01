/* Magic Mirror
 * Module: MMM-3DWeather
 *
 * By Scott Lewis
 * MIT Licensed.
 *
 * Comment on terminology: a 'flake' is any moving item being shown on the mirror, while
 * the specific themed items are called 'snow' or 'heart'. This applies to variable names
 * file names and css class names.
 */

Module.register("MMM-3DWeather", {
  defaults: {
    flakeCount: 100,
    theme: "winter", // pick from themes map below, i.e. winter, love
    api_key: "c5cf8af3d17140838bfcec85c2467d3b",
    lat: 0.0,
    lon: 0.0,
    units: "M",
    lang: "en",
    interval: 900000, // Every 15 mins
    tableView: false,
  },

  start: function () {
    Log.log("Starting module: " + this.name);

    // Set up the local values, here we construct the request url to use
    this.units = this.config.units;
    this.loaded = false;
    this.url =
      "https://api.weatherbit.io/v2.0/current?key=" +
      this.config.api_key +
      "&lat=" +
      this.config.lat +
      "&lon=" +
      this.config.lon +
      "&units=" +
      this.config.units +
      "&lang=" +
      this.config.lang;
    this.nowIcon = "";
    this.nowWeather = "";
    this.nowTemp = "";
    this.tableView = this.config.tableView;

    // Trigger the first request
    this.getWeatherData(this);
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
	var themeSettings = this.themes["winter"];
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";

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
    return wrapper;
  },

  getWeatherData: function (_this) {
    // Make the initial request to the helper then set up the timer to perform the updates
    _this.sendSocketNotification("GET-WEATHER-NOW", _this.url);
    setTimeout(_this.getWeatherData, _this.config.interval, _this);
  },

  socketNotificationReceived: function (notification, payload) {
    // check to see if the response was for us and used the same url
    if (notification === "GOT-WEATHER-NOW" && payload.url === this.url) {
      // we got some data so set the flag, stash the data to display then request the dom update
      this.loaded = true;
      this.nowIcon = payload.nowIcon;
      this.nowWeather = payload.nowWeather;
      this.nowTemp = payload.nowTemp;
      this.updateDom(1000);
    }
  },
});
