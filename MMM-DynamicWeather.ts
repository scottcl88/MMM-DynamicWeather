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
  duration: number;
  delay: number;
  images: string[];
  direction: string;
  size: number;
  isWeather: boolean;
  weatherCode: number;

  public getYear() {
    return this.year ? this.year : 0;
  }
  public getMonth() {
    return this.month ? this.month : 0;
  }
  public getDay() {
    return this.day ? this.day : 0;
  }

  public clone(other: Effect) {
    this.day = other.day;
    this.month = other.month;
    this.year = other.year;
    this.duration = other.duration;
    this.delay = other.delay;
    this.images = other.images;
    this.direction = other.direction;
    this.size = other.size;
    this.isWeather = other.isWeather;
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
    weatherDuration: 120000,
    weatherDelay: 60000,
    hideSnow: false,
    hideRain: false,
    hideClouds: false,
    effects: [
      {
        month: 2,
        day: 14,
        year: 0,
        duration: 60000,
        delay: 30000,
        images: ["heart1.png", "heart2.png"],
        direction: "up",
        size: 2,
      },
    ] as Effect[],
  },

  start: function () {
    this.now = new Date();
    this.initialized = false;
    this.loaded = false;
    this.doShowCustomEffects = true;
    this.doShowWeatherEffects = true;
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
    this.snowEffect.isWeather = true;
    this.snowEffect.duration = this.config.weatherDuration;
    this.snowEffect.delay = this.config.weatherDelay;

    this.loveEffect = new Effect();
    this.loveEffect.images = ["heart1.png", "heart2.png"];
    this.loveEffect.size = 2;
    this.loveEffect.direction = "up";
    this.loveEffect.duration = this.config.weatherDuration;
    this.loveEffect.delay = this.config.weatherDelay;

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

    if (this.config.alwaysDisplay) {
      switch (this.config.alwaysDisplay) {
        case "love": {
          this.showCustomEffect(wrapper, this.loveEffect);
          break;
        }
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

    console.log("GetDom: ", this.doShowCustomEffects);
    if (this.doShowCustomEffects) {
      this.config.effects.forEach((configEffect) => {
        var effect = new Effect();
        effect.clone(configEffect);

        var effectMonth = effect.month - 1;
        console.log("Showing effect: ", effect, effect.month, effect.day, effect.year);
        if (effect.getMonth() == 0 && effect.getDay() == 0 && effect.getYear() == 0) {
          this.showCustomEffect(wrapper, effect);
        } else if (this.now.getMonth() == effectMonth && this.now.getDate() == effect.day) {
          if (effect.year == 0 || this.now.getYear() == effect.year) {
            this.showCustomEffect(wrapper, effect);
          }
        }
      });
    }

    if (this.doShowWeatherEffects) {
      //Codes from https://openweathermap.org/weather-conditions
      if (this.weatherCode >= 600 && this.weatherCode <= 622 && !this.config.hideSnow) {
        this.showCustomEffect(wrapper, this.snowEffect);
      } else if (this.weatherCode >= 200 && this.weatherCode <= 531 && !this.config.hideRain) {
        this.makeItRain(wrapper);
      } else if (this.weatherCode >= 801 && this.weatherCode <= 804 && !this.config.hideClouds) {
        this.makeItCloudy(wrapper);
      }
    }

    return wrapper;
  },

  showCustomEffect: function (wrapper: HTMLDivElement, effect: Effect) {
    if (effect.isWeather) {
      this.doShowWeatherEffects = false;
    } else {
      this.doShowCustomEffects = false;
    }
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
    console.log("Going to wait for: ", effect.duration);
    setTimeout(this.stopEffect, effect.duration, this, wrapper, effect);
  },

  makeItRain: function (wrapper) {
    this.doShowWeatherEffects = false;
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
    var rainEffect = new Effect();
    rainEffect.isWeather = true;
    setTimeout(this.stopEffect, this.config.weatherDuration, this, wrapper, rainEffect);
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
    var cloudEffect = new Effect();
    cloudEffect.isWeather = true;
    setTimeout(this.stopEffect, this.config.weatherDuration, this, wrapper, cloudEffect);
  },

  stopEffect: function (_this, wrapper, effect: Effect) {
    //clear elements
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
    _this.updateDom();

    let delay = effect.isWeather ? _this.config.weatherDelay : effect.delay;
    setTimeout(
      (_that, _effect) => {
        if (_effect.isWeather) {
          _that.doShowWeatherEffects = true;
        } else {
          _that.doShowCustomEffects = true;
        }
        _that.updateDom();
      },
      delay,
      _this,
      effect
    );
  },

  getWeatherAPI: function (_this) {
    _this.sendSocketNotification("API-Fetch", _this.url);
    setTimeout(_this.getWeatherData, _this.config.interval, _this);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "API-Received" && payload.url === this.url) {
      this.loaded = true;
      this.weatherCode = 801; //payload.result.weather[0].id;
      this.doShowWeatherEffects = true;
      this.doShowCustomEffects = true;
      this.updateDom();
    }
  },
});
