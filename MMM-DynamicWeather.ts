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
      particleCount: 100,
      api_key: "",
      locationID: 0,
      lat: 0,
      lon: 0,
      weatherInterval: 600000, // Every 10 minutes,
      alwaysDisplay: "",
      zIndex: 99,
      effectDuration: 0,
      effectDelay: 0,
      effects: []
    },
  
    start: function () {
      this.initialized = false;
      this.loaded = false;
      this.url =
        "https://api.openweathermap.org/data/2.5/weather?appid=" +
        this.config.api_key;
  
      if (this.config.lat && this.config.lon) {
        this.url += "&lat=" + this.config.lat + "&lon=" + this.config.lon;
      }
  
      if (this.locationID) {
        this.url += "&id=" + this.config.locationID;
      }
  
      this.weatherCode = 0;
  
      if (!this.config.alwaysDisplay) {
        this.getWeatherAPI(this);
      }
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
      var wrapper = document.createElement("div");
      wrapper.className = "wrapper";
      wrapper.style.zIndex = this.config.zIndex;
  
      if (this.config.alwaysDisplay) {
        switch (this.config.alwaysDisplay) {
          case "love": {
            this.showEffect(wrapper, "love");
            break;
          }
          case "snow": {
            this.showEffect(wrapper, "winter");
            break;
          }
          case "rain": {
            this.makeItRain(wrapper);
            break;
          }
          case "cloudy": {
            this.makeItCloudy(wrapper);
            break;
          }
          default: {
            console.error("Invalid config option 'alwaysDisplay'");
          }
        }
        return wrapper;
      }
  
      var now = new Date();
      if (now.getMonth() == 1 && now.getDate() == 14) {
        this.showEffect(wrapper, "love");
      }
  
      //Codes from https://openweathermap.org/weather-conditions
      if (this.weatherCode >= 600 && this.weatherCode <= 622) {
        this.showEffect(wrapper, "snow");
      } else if (this.weatherCode >= 200 && this.weatherCode <= 531) {
        this.makeItRain(wrapper);
      } else if (this.weatherCode >= 801 && this.weatherCode <= 804) {
        this.makeItCloudy(wrapper);
      }
  
      return wrapper;
    },
    //taken from https://github.com/MichMich/MMM-Snow
    showEffect: function (wrapper, theme) {
      var themeSettings = this.themes[theme];
      var flake, jiggle, size;
  
      for (var i = 0; i < this.config.particleCount; i++) {
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
      setTimeout(stopEffect, this.config.effectDuration, wrapper, theme);
    },
  
    makeItRain: function (wrapper) {
      var increment = 0;
      while (increment < this.config.particleCount) {
        var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1); //random number between 98 and 1
        var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
  
        increment += randoFiver;
  
        let frontDrop = document.createElement("div");
        frontDrop.classList.add("drop");
        frontDrop.style.left = increment + "%";
        frontDrop.style.bottom = randoFiver + randoFiver - 1 + 100 + "%";
        frontDrop.style.animationDelay = "1." + randoHundo + "s";
        frontDrop.style.animationDuration = "1.5" + randoHundo + "s";
  
        let frontStem = document.createElement("div");
        frontStem.classList.add("stem");
        frontStem.style.animationDelay = "1." + randoHundo + "s";
        frontStem.style.animationDuration = "1.5" + randoHundo + "s";
        frontDrop.appendChild(frontStem);
  
        let backDrop = document.createElement("div");
        backDrop.classList.add("drop");
        backDrop.style.opacity = "0.5";
        backDrop.style.right = increment + "%";
        backDrop.style.bottom = randoFiver + randoFiver - 1 + 100 + "%";
        backDrop.style.animationDelay = "1." + randoHundo + "s";
        backDrop.style.animationDuration = "1.5" + randoHundo + "s";
  
        let backStem = document.createElement("div");
        backStem.classList.add("stem");
        backStem.style.animationDelay = "1." + randoHundo + "s";
        backStem.style.animationDuration = "1.5" + randoHundo + "s";
        backDrop.appendChild(backStem);
  
        wrapper.appendChild(backDrop);
        wrapper.appendChild(frontDrop);
      }
    },
  
    makeItCloudy: function (wrapper) {
      var increment = 0;
      while (increment < this.config.particleCount) {
        var randNum = Math.floor(Math.random() * (25 - 5 + 1) + 5); //random number between 25 and 5
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
  
    stopEffect: function (_this, wrapper, effectOptions) {
      //clear elements
      while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }
      this.updateDom();
      //wait for delay to start effect again
      setTimeout(showEffect, this.config.effectDelay, wrapper, theme);
    },
  
    getWeatherAPI: function (_this) {
      _this.sendSocketNotification("API-Fetch", _this.url);
      setTimeout(_this.getWeatherData, _this.config.interval, _this);
    },
  
    socketNotificationReceived: function (notification, payload) {
      if (notification === "API-Received" && payload.url === this.url) {
        this.loaded = true;
        this.weatherCode = payload.result.weather.id;
        console.log("WeatherCode: ", this.weatherCode);
        this.updateDom();
      }
    },
  });
  