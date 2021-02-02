/* Magic Mirror
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * A simple module to display different images based on current weather
 */
Module.register("MMM-DynamicWeather", {
  defaults: {
    flakeCount: 100,
    api_key: "c5cf8af3d17140838bfcec85c2467d3b",
    lat: 39.822948,
    lon: -84.017937,
    interval: 600000, // Every 10 minutes
  },

  start: function () {
    this.initialized = false;
    this.loaded = false;
    this.url =
      "https://api.weatherbit.io/v2.0/current?key=" +
      this.config.api_key +
      "&lat=" +
      this.config.lat +
      "&lon=" +
      this.config.lon;
    this.weatherCode = 0;
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
  },

  getStyles: function () {
    return ["MMM-DynamicWeather.css"];
  },

  getDom: function () {
    var now = new Date();
    if (now.getMonth() == 2 && now.getDate() == 14) {
      this.showEffect(wrapper, "love");
    }

    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    if (this.weatherCode >= 600 && this.weatherCode <= 623) {
      this.showEffect(wrapper, "snow");
    } else if (this.weatherCode >= 200 && this.weatherCode <= 522) {
      this.makeItRain(wrapper);
    } else if (this.weatherCode >= 801 && this.weatherCode <= 804) {
      this.makeItCloudy(wrapper);
    }

    return wrapper;
  },

  showEffect: function (wrapper, theme) {
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

  makeItRain: function (wrapper) {
    var increment = 0;
    while (increment < 100) {
      var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1); //random number between 98 and 1
      var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);

      increment += randoFiver;

      let drop = document.createElement("div");
      drop.classList.add("drop");
      drop.style.left = increment + "%";
      drop.style.bottom = randoFiver + randoFiver - 1 + 100 + "%";
      drop.style.animationDelay = "0." + randoHundo + "s";
      drop.style.animationDuration = "0.5" + randoHundo + "s";

      let stem = document.createElement("div");
      stem.classList.add("stem");
      stem.style.animationDelay = "0." + randoHundo + "s";
      stem.style.animationDuration = "0.5" + randoHundo + "s";
      drop.appendChild(stem);

      wrapper.appendChild(drop);
    }
  },

  makeItCloudy: function (wrapper) {
    var increment = 0;
    while (increment < 50) {
      var randNum = Math.floor(Math.random() * (5 - 2 + 1) + 2); //random number between 5 and 2
      var speed = Math.floor(Math.random() * (35 - 15 + 1) + 15);
      var size = Math.floor(Math.random() * (60 - 3 + 1) + 3);

      increment += randNum;

      let cloudBase = document.createElement("div");
      cloudBase.style.animation = "animateCloud " + speed + "s linear infinite";
      cloudBase.style.transform = "scale(0." + size + ")";

      let cloud = document.createElement("div");
      cloud.classList.add("cloud");
      cloudBase.appendChild(cloud);

      wrapper.appendChild(cloudBase);
    }
  },

  getWeatherAPI: function (_this) {
    _this.sendSocketNotification("API-Fetch", _this.url);
    setTimeout(_this.getWeatherData, _this.config.interval, _this);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Received" && payload.url === this.url) {
      this.loaded = true;
      this.weatherCode = parseInt(payload.result.data[0].weather.code);
      this.updateDom(1000);
    }
  },
});
