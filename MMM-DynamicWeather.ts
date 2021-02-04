/* Magic Mirror
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * A simple module to display different images based on current weather
 */
declare var Module: any;
class Effect {
  constructor() {}
  month: number;
  day: number;
  year: number = 0;
  images: string[];
  direction: string;
  size: number;
  weatherCode: number;

  public getYear(): number {
    return this.year ? this.year : 0;
  }
  public getMonth(): number {
    return this.month ? this.month : 0;
  }
  public getDay(): number {
    return this.day ? this.day : 0;
  }
  public getSize(): number {
    return this.size ? this.size : 1;
  }
  public getWeatherCode(): number {
    return this.weatherCode ? this.weatherCode : -99;
  }
  public hasWeatherCode(): boolean {
    return this.weatherCode && this.weatherCode > 0 ? true : false;
  }
  public clone(other: Effect) {
    this.day = other.day;
    this.month = other.month;
    this.year = other.year;
    this.images = other.images;
    this.direction = other.direction;
    this.size = other.size;
    this.weatherCode = other.weatherCode;
  }
}
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
    effectDuration: 120000,
    effectDelay: 60000,
    hideSnow: false,
    hideRain: false,
    hideClouds: false,
    effects: [] as Effect[],
  },

  start: function () {
    this.now = new Date();
    this.initialized = false;
    this.loaded = false;
    this.doShowEffects = true;
    this.effectDurationTimeout = null;
    this.effectDelayTimeout = null;
    this.url = "https://api.openweathermap.org/data/2.5/weather?appid=" + this.config.api_key;

    if (this.config.lat && this.config.lon) {
      this.url += "&lat=" + this.config.lat + "&lon=" + this.config.lon;
    }

    if (this.config.locationID) {
      this.url += "&id=" + this.config.locationID;
    }

    this.snowEffect = new Effect();
    this.snowEffect.images = ["snow1.png", "snow2.png", "snow3.png"];
    this.snowEffect.size = 1;
    this.snowEffect.direction = "down";

    this.weatherCode = 0;

    if (!this.config.alwaysDisplay) {
      this.getWeatherAPI(this);
    }
  },

  getStyles: function () {
    return ["MMM-DynamicWeather.css"];
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.style.zIndex = this.config.zIndex;

    // if (!this.loaded) return wrapper; //need to wait for the weather to first be loaded

    if (this.config.alwaysDisplay) {
      switch (this.config.alwaysDisplay) {
        case "snow": {
          this.showCustomEffect(wrapper, this.snowEffect);
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

    // console.log("GetDom: ", this.doShowEffects, this.weatherCode);
    if (!this.doShowEffects) return wrapper;

    this.config.effects.forEach((configEffect) => {
      var effect = new Effect();
      effect.clone(configEffect);

      var effectMonth = effect.getMonth() - 1;
      // console.log("Showing effect: ", effect.hasWeatherCode(), effect.getMonth(), effect.getDay(), effect.getYear(), this.now.getMonth(), this.now.getDate(), this.now.getFullYear());
      if (effect.getWeatherCode() == this.weatherCode) { 
        this.showCustomEffect(wrapper, effect);
      } else if (!effect.hasWeatherCode() && effect.getMonth() == 0 && effect.getDay() == 0 && effect.getYear() == 0) {
        this.showCustomEffect(wrapper, effect);
      } else if (!effect.hasWeatherCode() && this.now.getMonth() == effectMonth && this.now.getDate() == effect.day) {
        if (effect.getYear() == 0 || this.now.getFullYear() == effect.getYear()) {
          this.showCustomEffect(wrapper, effect);
        }
      }
    });

    //Codes from https://openweathermap.org/weather-conditions
    if (this.weatherCode >= 600 && this.weatherCode <= 622 && !this.config.hideSnow) {
      this.showCustomEffect(wrapper, this.snowEffect);
    } else if (this.weatherCode >= 200 && this.weatherCode <= 531 && !this.config.hideRain) {
      this.makeItRain(wrapper);
    } else if (this.weatherCode >= 801 && this.weatherCode <= 804 && !this.config.hideClouds) {
      this.makeItCloudy(wrapper);
    }

    // console.log("Going to wait for: ", this.config.effectDuration);
    this.effectDurationTimeout = setTimeout(this.stopEffect, this.config.effectDuration, this, wrapper);

    return wrapper;
  },

  showCustomEffect: function (wrapper: HTMLDivElement, effect: Effect) {
    this.doShowEffects = false;
    var flake, jiggle, size;

    for (var i = 0; i < this.config.particleCount; i++) {
      size = effect.size; // * (Math.random() * 0.75) + 0.25;
      let flakeImage = document.createElement("div");

      let maxNum = effect.images.length;
      var picIndex = Math.floor(Math.random() * (maxNum - 0) + 0);
      // console.log("Setting up effect image: ", effect.images[picIndex]);
      flakeImage.style.backgroundImage = "url('./modules/MMM-DynamicWeather/images/" + effect.images[picIndex] + "')";
      flakeImage.style.transform = "scale(" + size + ", " + size + ")";
      flakeImage.style.opacity = size;

      flake = document.createElement("div");
      if (effect.direction == "down") {
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
    this.doShowEffects = false;
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
    this.doShowEffects = false;
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

  stopEffect: function (_this, wrapper) {
    //clear elements
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
    _this.updateDom();

    let delay = this.config.effectDelay;
    this.effectDelayTimeout = setTimeout(
      (_that, _effect) => {
        _that.doShowEffects = true;
        _that.updateDom();
      },
      delay,
      _this
    );
  },

  getWeatherAPI: function (_this) {
    _this.sendSocketNotification("API-Fetch", _this.url);
    setTimeout(_this.getWeatherData, _this.config.interval, _this);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Received" && payload.url === this.url) {
      this.loaded = true;
      var newCode = payload.result.weather[0].id;
      var doUpdate = false;

      //check to see if the newCode is different than already displayed, and if so, is it going to show anything
      if (newCode != this.weatherCode) {
        if (newCode >= 600 && newCode <= 622 && !this.config.hideSnow) {
          doUpdate = true;
        }
        if (newCode >= 200 && newCode <= 531 && !this.config.hideRain) {
          doUpdate = true;
        }
        if (newCode >= 801 && newCode <= 804 && !this.config.hideClouds) {
          doUpdate = true;
        }
        this.config.effects.forEach((configEffect) => {
          var effect = new Effect();
          effect.clone(configEffect);
          if (effect.weatherCode == newCode) {
            doUpdate = true;
          }
        });
      }

      //only update the dom if the weather is different
      if (doUpdate) {
        this.weatherCode = newCode;
        this.doShowEffects = true;
        clearTimeout(this.effectDurationTimeout);
        clearTimeout(this.effectDelayTimeout);
        this.updateDom();
      }
    }
  },
});
