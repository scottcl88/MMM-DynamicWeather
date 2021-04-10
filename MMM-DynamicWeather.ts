/* Magic Mirror
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * A heavily configurable MagicMirror Module to display different animations based on current weather and show customized event effects.
 */
declare var Log: Console;
declare var Module: any;
class Effect {
  constructor() {}
  id: number; //an id made up to use for sequential logic
  month: number;
  day: number;
  year: number = 0;
  images: string[];
  direction: string;
  size: number;
  particleCount: number;
  speedMax: number;
  speedMin: number;
  weatherCode: number;
  weatherCodeMin: number;
  weatherCodeMax: number;
  holiday: string;
  recurrence: string; //monthly, weekly, weekdays, weekends
  doDisplay: boolean = false;

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
  public getParticleCount(): number {
    return this.particleCount ? this.particleCount : -1;
  }
  public getSpeedMax(): number {
    return this.speedMax ? this.speedMax : 100;
  }
  public getSpeedMin(): number {
    return this.speedMin ? this.speedMin : 50;
  }
  public getWeatherCode(): number {
    return this.weatherCode ? this.weatherCode : -99;
  }
  public getMinWeatherCode(): number {
    return this.weatherCodeMin ? this.weatherCodeMin : 99999;
  }
  public getMaxWeatherCode(): number {
    return this.weatherCodeMax ? this.weatherCodeMax : -99999;
  }
  public hasWeatherCode(): boolean {
    return (this.weatherCode && this.weatherCode > 0) || (this.weatherCodeMin && this.weatherCodeMin > 0) || (this.weatherCodeMax && this.weatherCodeMax > 0) ? true : false;
  }
  public hasHoliday(): boolean {
    return this.holiday && this.holiday.length > 0 ? true : false;
  }
  public clone(other: Effect) {
    this.id = other.id;
    this.day = other.day;
    this.month = other.month;
    this.year = other.year;
    this.images = other.images;
    this.direction = other.direction;
    this.size = other.size;
    this.particleCount = other.particleCount;
    this.speedMax = other.speedMax;
    this.speedMin = other.speedMin;
    this.weatherCode = other.weatherCode;
    this.weatherCodeMin = other.weatherCodeMin;
    this.weatherCodeMax = other.weatherCodeMax;
    this.holiday = other.holiday;
    this.recurrence = other.recurrence;
    this.doDisplay = other.doDisplay;
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
    opacity: 1,
    fadeDuration: 3000,
    effectDuration: 120000,
    effectDelay: 60000,
    realisticClouds: false,
    hideSun: false,
    hideSnow: false,
    hideSnowman: true,
    hideRain: false,
    hideFlower: true,
    hideClouds: false,
    hideFog: false,
    hideLightning: false,
    lightning1Count: 2,
    lightning2Count: 3,
    sequential: "",
    sunImage: "sun_right",
    effects: [] as Effect[],
  },

  start: function () {
    Log.info("Starting MMM-DynamicWeather");
    this.now = new Date();
    this.initialized = false;
    this.weatherLoaded = false;
    this.holidayLoaded = false;
    this.doShowEffects = true;
    this.hasDateEffectsToDisplay = false;
    this.hasHolidayEffectsToDisplay = false;
    this.hasWeatherEffectsToDisplay = true;
    this.effectDurationTimeout = null;
    this.effectDelayTimeout = null;
    this.weatherTimeout = null;
    this.holidayTimeout = null;
    this.allEffects = [] as Effect[];
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

    (this.realisticCloudsEffect as Effect) = new Effect();
    (this.realisticCloudsEffect as Effect).size = 15;
    (this.realisticCloudsEffect as Effect).direction = "left-right";
    (this.realisticCloudsEffect as Effect).images = ["cloud1.png", "cloud2.png"];

    this.weatherCode = 0;

    this.allHolidays = [] as string[];

    let count = 0;
    this.config.effects.forEach((configEffect) => {
      var effect = new Effect();
      effect.clone(configEffect);
      effect.id = count;
      count++;
      this.allEffects.push(effect);
      this.allHolidays.push(effect.holiday);
    });

    this.lastSequentialId = -1;
    if (this.config.sequential) {
      if (this.config.sequential == "effect" || this.config.sequential == "effect-one") {
        this.lastSequential = "weather";
      } else if (this.config.sequential == "weather") {
        this.lastSequential = "effect";
      } else {
        this.lastSequential = "";
      }
    } else {
      this.lastSequential = "";
    }

    this.checkDates();

    if (this.allHolidays.length > 0) {
      this.getHolidays(this);
    } else {
      this.holidayLoaded = true;
    }

    if (!this.config.alwaysDisplay) {
      this.getWeather(this);
    } else {
      this.weatherLoaded = true;
    }
    Log.info("[MMM-DynamicWeather] Finished initialization");
  },

  getStyles: function () {
    return ["MMM-DynamicWeather.css"];
  },

  checkDates: function () {
    try {
      (this.allEffects as Effect[]).forEach((effect) => {
        var effectMonth = effect.month - 1;
        if (!effect.hasWeatherCode() && !effect.hasHoliday()) {
          //if there is weatherCode or holiday, dates are ignored
          if (effect.getMonth() == 0 && effect.getDay() == 0 && effect.getYear() == 0) {
            //if no weatherCode, no holiday and no dates, then always display it
            if (effect.recurrence == "weekdays") {
              //if its not Sunday (0) and not Saturday (6)
              if (this.now.getDay() !== 6 && this.now.getDay() !== 0) {
                this.hasDateEffectsToDisplay = true;
                effect.doDisplay = true;
              }
            } else if (effect.recurrence == "weekends") {
              //if its Sunday (0) or Saturday (6)
              if (this.now.getDay() == 6 || this.now.getDay() == 0) {
                this.hasDateEffectsToDisplay = true;
                effect.doDisplay = true;
              }
            } else {
              this.hasDateEffectsToDisplay = true;
              effect.doDisplay = true;
            }
          } else {
            //if the month and date match or the month, date and year match
            if (this.now.getMonth() == effectMonth && this.now.getDate() == effect.day) {
              if (effect.getYear() == 0 || this.now.getFullYear() == effect.getYear()) {
                this.hasDateEffectsToDisplay = true;
                effect.doDisplay = true;
              }
            } else if (effect.recurrence == "monthly") {
              //ignore everything but the day
              if (this.now.getDate() == effect.getDay()) {
                this.hasDateEffectsToDisplay = true;
                effect.doDisplay = true;
              }
            } else if (effect.recurrence == "weekly") {
              var effectDay = new Date(effect.getYear(), effectMonth, effect.getDay());
              if (this.now.getDay() == effectDay.getDay()) {
                this.hasDateEffectsToDisplay = true;
                effect.doDisplay = true;
              }
            }
          }
        }
      });
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in checkDates: ", error);
    }
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.style.zIndex = this.config.zIndex;
    wrapper.style.opacity = this.config.opacity;
    wrapper.className = "wrapper";
    try {
      //setup the fade-out animation
      var fadeDuration = parseInt(this.config.fadeDuration);
      var animationDelay = parseInt(this.config.effectDuration) - fadeDuration;
      var fadeCSS = document.createElement("style");
      fadeCSS.innerHTML = ".fade-out {animation-name: fade; animation-duration: " + fadeDuration + "ms; animation-delay: " + animationDelay + "ms;}";
      wrapper.prepend(fadeCSS);

      wrapper.onanimationend = (e) => {
        //delay finished, elements faded out, now remove
        var thisAnimation = e.animationName;
        if (thisAnimation == "fade") {
          wrapper.remove();
        }
      };

      if (this.config.alwaysDisplay) {
        switch (this.config.alwaysDisplay) {
          case "snow": {
            this.showCustomEffect(wrapper, this.snowEffect);
            if (this.config.hideSnowman === false || this.config.hideSnowman === "false") {
              this.buildSnowman(wrapper);
            }
            break;
          }
          case "sun": {
            this.makeItSunny(wrapper);
            break;
          }
          case "rain": {
            this.makeItRain(wrapper);
            if (this.config.hideFlower === false || this.config.hideFlower === "false") {
              this.buildFlower(wrapper);
            }
            break;
          }
          case "lightning": {
            this.makeItLightning(wrapper);
            break;
          }
          case "rain-lightning": {
            this.makeItRain(wrapper);
            this.makeItLightning(wrapper);
            break;
          }
          case "cloudy": {
            if (this.config.realisticClouds) {
              this.showCustomEffect(wrapper, this.realisticCloudsEffect);
            } else {
              this.makeItCloudy(wrapper);
            }
            break;
          }
          case "fog": {
            this.makeItFoggy(wrapper);
            break;
          }
          default: {
            console.error("[MMM-DynamicWeather] Invalid config option 'alwaysDisplay'");
          }
        }
        return wrapper;
      }

      if (!this.weatherLoaded || !this.holidayLoaded) return wrapper; //need to wait for the weather to first be loaded

      if (!this.doShowEffects) return wrapper;

      wrapper.className = "wrapper fade-out";

      let showEffects = false;
      let showWeather = false;

      //check to see what should be shown based on availability and sequential
      if (this.hasDateEffectsToDisplay || this.hasHolidayEffectsToDisplay || this.hasWeatherEffectsToDisplay) {
        if (this.lastSequential == "effect" && this.hasWeatherEffectsToDisplay) {
          //if its weather's turn and there are weather to show
          showWeather = true;
          this.lastSequential = "weather";
        } else if (this.lastSequential == "weather" && (this.hasDateEffectsToDisplay || this.hasHolidayEffectsToDisplay)) {
          //if its effect's turn and there are effects to show
          showEffects = true;
          this.lastSequential = "effect";
        } else {
          showWeather = true;
          showEffects = true;
        }
      }

      if (showEffects) {
        for (let effect of this.allEffects as Effect[]) {
          if (effect.doDisplay) {
            //we can display this effect
            if (this.config.sequential == "effect-one") {
              //only show one effect at a time. if it wasn't the last one and its next in line, then do show it
              if (this.lastSequentialId < effect.id) {
                this.lastSequentialId = effect.id;
                if (this.allEffects.length - 1 == this.lastSequentialId) {
                  //reached end of effects, reset
                  this.lastSequentialId = -1;
                }
                this.showCustomEffect(wrapper, effect);
                break;
              }
            } else {
              this.showCustomEffect(wrapper, effect);
            }
          }
        }
      }

      if (showWeather) {
        //Codes from https://openweathermap.org/weather-conditions
        if (this.weatherCode >= 600 && this.weatherCode <= 622 && !this.config.hideSnow) {
          this.showCustomEffect(wrapper, this.snowEffect);
          if (this.config.hideSnowman === false || this.config.hideSnowman === "false") {
            this.buildSnowman(wrapper);
          }
          if (this.weatherCode >= 611 && this.weatherCode <= 622 && !this.config.hideRain) {
            //snow/rain mix
            this.makeItRain(wrapper);
          }
        } else if (this.weatherCode >= 200 && this.weatherCode <= 531 && !this.config.hideRain) {
          this.makeItRain(wrapper);
          if (this.config.hideFlower === false || this.config.hideFlower === "false") {
            this.buildFlower(wrapper);
          }
          if (this.weatherCode >= 200 && this.weatherCode <= 232 && !this.config.hideLightning) {
            this.makeItLightning(wrapper);
          }
        } else if (this.weatherCode >= 801 && this.weatherCode <= 804 && !this.config.hideClouds) {
          if (this.config.realisticClouds) {
            if (this.weatherCode == 801) {
              (this.realisticCloudsEffect as Effect).size = 8;
              (this.realisticCloudsEffect as Effect).particleCount = 30;
              (this.realisticCloudsEffect as Effect).images = ["cloud1.png"];
            } else if (this.weatherCode == 802) {
              (this.realisticCloudsEffect as Effect).size = 8;
              (this.realisticCloudsEffect as Effect).particleCount = 50;
              (this.realisticCloudsEffect as Effect).images = ["cloud1.png", "cloud2.png"];
            } else if (this.weatherCode == 803) {
              (this.realisticCloudsEffect as Effect).size = 15;
              (this.realisticCloudsEffect as Effect).particleCount = 30;
              (this.realisticCloudsEffect as Effect).images = ["cloud1.png", "cloud2.png"];
            } else if (this.weatherCode == 804) {
              (this.realisticCloudsEffect as Effect).size = 15;
              (this.realisticCloudsEffect as Effect).particleCount = 30;
              (this.realisticCloudsEffect as Effect).images = ["cloud3.png", "cloud2.png", "cloud1.png"];
            }
            this.showCustomEffect(wrapper, this.realisticCloudsEffect);
          } else {
            this.makeItCloudy(wrapper);
          }
        } else if (this.weatherCode >= 701 && this.weatherCode <= 781 && !this.config.hideFog) {
          this.makeItFoggy(wrapper);
        }else if (this.weatherCode == 800 && !this.config.hideSun) {
          this.makeItSunny(wrapper);
        }
      }

      console.info("[MMM-DynamicWeather] Displaying effects for: ", this.config.effectDuration);
      this.effectDurationTimeout = setTimeout(this.stopEffect, this.config.effectDuration, this);
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in getDom: ", error);
    }
    return wrapper;
  },

  showCustomEffect: function (wrapper: HTMLDivElement, effect: Effect) {
    this.doShowEffects = false;
    var flake, jiggle, size;

    var particleCount = effect.getParticleCount();
    if (particleCount < 0) {
      particleCount = this.config.particleCount;
    }

    for (var i = 0; i < particleCount; i++) {
      size = effect.getSize(); // * (Math.random() * 0.75) + 0.25;
      let flakeImage = document.createElement("div");

      let maxNum = effect.images.length;
      var picIndex = Math.floor(Math.random() * (maxNum - 0) + 0);
      flakeImage.style.backgroundImage = "url('./modules/MMM-DynamicWeather/images/" + effect.images[picIndex] + "')";
      flakeImage.style.transform = "scale(" + size + ", " + size + ")";
      flakeImage.style.opacity = size;

      flake = document.createElement("div");
      var animationName;

      switch (effect.direction) {
        case "down": {
          flake.className = "flake-downwards";
          flake.style.left = Math.random() * 100 - 10 + "%";
          animationName = "flake-jiggle";
          break;
        }
        case "left-right": {
          flake.className = "flake-left-right";
          flake.style.left = -75 - size * 2 + "px";
          flake.style.top = Math.random() * 100 - 10 + "%";
          flake.style.animationName = "flake-jiggle-left-right";
          break;
        }
        case "right-left": {
          flake.className = "flake-right-left";
          flake.style.right = 75 + size * 2 + "px";
          flake.style.top = Math.random() * 100 - 10 + "%";
          flake.style.animationName = "flake-jiggle-right-left";
          break;
        }
        default: {
          flake.className = "flake-upwards";
          flake.style.left = Math.random() * 100 - 10 + "%";
          animationName = "flake-jiggle";
          break;
        }
      }

      let max = effect.getSpeedMax();
      let min = effect.getSpeedMin();

      jiggle = document.createElement("div");
      jiggle.style.animationDelay = Math.random() * max + "s";
      jiggle.style.animationDuration = max - Math.random() * min * size + "s";
      if (animationName) {
        jiggle.style.animationName = animationName;
      }

      jiggle.appendChild(flakeImage);

      size = Math.random() * 0.75 + 0.25;
      jiggle.style.transform = "scale(" + size + ", " + size + ")";
      jiggle.style.opacity = size;
      if (animationName) {
        jiggle.style.animationName = animationName;
      }

      flake.appendChild(jiggle);

      flake.style.animationDelay = Math.random() * max + "s";
      flake.style.animationDuration = max - Math.random() * min * size + "s";

      wrapper.appendChild(flake);
    }
  },

  buildSnowman: function (wrapper) {
    this.doShowEffects = false;

    var snowmanImage = document.createElement("div");
    snowmanImage.classList.add("snowman");
    snowmanImage.style.animationDuration = this.config.effectDuration - 10000 + "ms"; //subtract for 10s delay

    wrapper.appendChild(snowmanImage);
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

  buildFlower: function (wrapper) {
    this.doShowEffects = false;

    var flowerImage = document.createElement("div");
    flowerImage.classList.add("flower");
    flowerImage.style.animationDuration = this.config.effectDuration - 10000 + "ms"; //subtract for 10s delay

    wrapper.appendChild(flowerImage);
  },

  makeItLightning: function (wrapper) {
    this.doShowEffects = false;

    var lightningImage1 = document.createElement("div");
    lightningImage1.classList.add("lightning1");
    lightningImage1.style.animationIterationCount = this.config.lightning1Count;

    var lightningImage2 = document.createElement("div");
    lightningImage2.classList.add("lightning2");
    lightningImage2.style.animationIterationCount = this.config.lightning2Count;

    let lightningPlayer = document.createElement("div");
    lightningPlayer.classList.add("lightningPlayer");
    lightningPlayer.appendChild(lightningImage1);
    lightningPlayer.appendChild(lightningImage2);

    wrapper.appendChild(lightningPlayer);
  },

  makeItSunny: function (wrapper) {
    this.doShowEffects = false;

    var sunImage = document.createElement("div");
    sunImage.classList.add("sun");
    sunImage.style.background = "url('./modules/MMM-DynamicWeather/images/" + this.config.sunImage + ".png')  center center/cover no-repeat transparent";

    let sunPlayer = document.createElement("div");
    sunPlayer.classList.add("sunPlayer");
    sunPlayer.appendChild(sunImage);

    wrapper.appendChild(sunPlayer);
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

  makeItFoggy: function (wrapper) {
    this.doShowEffects = false;

    var fogImage1 = document.createElement("div");
    fogImage1.classList.add("image01");

    var fogImage2 = document.createElement("div");
    fogImage2.classList.add("image02");

    let fogPlayer1 = document.createElement("div");
    fogPlayer1.id = "foglayer_01";
    fogPlayer1.classList.add("fog");
    fogPlayer1.appendChild(fogImage1);
    fogPlayer1.appendChild(fogImage2);

    wrapper.appendChild(fogPlayer1);

    fogImage1 = document.createElement("div");
    fogImage1.classList.add("image01");

    fogImage2 = document.createElement("div");
    fogImage2.classList.add("image02");

    let fogPlayer2 = document.createElement("div");
    fogPlayer2.id = "foglayer_02";
    fogPlayer2.classList.add("fog");
    fogPlayer2.appendChild(fogImage1);
    fogPlayer2.appendChild(fogImage2);

    wrapper.appendChild(fogPlayer2);

    fogImage1 = document.createElement("div");
    fogImage1.classList.add("image01");

    fogImage2 = document.createElement("div");
    fogImage2.classList.add("image02");

    let fogPlayer3 = document.createElement("div");
    fogPlayer3.id = "foglayer_03";
    fogPlayer3.classList.add("fog");
    fogPlayer3.appendChild(fogImage1);
    fogPlayer3.appendChild(fogImage2);

    wrapper.appendChild(fogPlayer3);
  },

  stopEffect: function (_this) {
    try {
      //wait for delay and reset
      _this.updateDom();
      let delay = _this.config.effectDelay;
      _this.effectDelayTimeout = setTimeout(
        (_that, _effect) => {
          _that.doShowEffects = true;
          _that.updateDom();
        },
        delay,
        _this
      );
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in stopping effects: ", error);
    }
  },

  getWeather: function (_this) {
    _this.sendSocketNotification("API-Fetch", _this.url);
    _this.weatherTimeout = setTimeout(_this.getWeather, _this.config.weatherInterval, _this);
  },
  getHolidays: function (_this) {
    try {
      _this.sendSocketNotification("Holiday-Fetch", {});
      var today = new Date();
      var tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      var msTillMidnight = tomorrow.getTime() - today.getTime();
      console.info("[MMM-DynamicWeather] Holidays have been fetched, waiting till midnight (" + msTillMidnight + " ms) to reset.");
      _this.holidayTimeout = setTimeout(_this.resetHolidays, msTillMidnight, _this);
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in getHolidays: ", error);
    }
  },
  resetHolidays: function (_this) {
    try {
      console.info("[MMM-DynamicWeather] Resetting holidays...");
      //Reset all effects with a holiday to not show, we will trigger another getHolidays to see if the next day has another holiday to display next
      (_this.allEffects as Effect[]).forEach((effect) => {
        if (effect.holiday) {
          effect.doDisplay = false;
        }
      });
      _this.hasHolidayEffectsToDisplay = false;
      _this.updateDom();
      console.info("[MMM-DynamicWeather] Holidays reset.");
      _this.getHolidays(_this);
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in resetting holidays: ", error);
    }
  },

  parseHolidays: function (body: string) {
    let today = new Date();
    let todayHolidays = [];
    todayHolidays.push("test");

    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(body, "text/html");

      var children = doc.getElementById("holidays-table").children[1].children;
      for (var i = 0; i < children.length; i++) {
        var child1 = children[i];
        if (child1.hasAttribute("data-date")) {
          var holidayDateStr = child1.getAttribute("data-date");
          var child2 = child1.children;
          for (var j = 0; j < child2.length; j++) {
            var child3 = child2[j];
            if (child3.hasChildNodes()) {
              for (var k = 0; k < child3.children.length; k++) {
                var child4 = child3.children[k];
                for (var l = 0; l < this.allHolidays.length; l++) {
                  var effectHoliday = this.allHolidays[l];
                  if (child4.textContent == effectHoliday) {
                    var holidayDate = new Date(parseInt(holidayDateStr));
                    if (holidayDate.getUTCDate() == today.getDate() && holidayDate.getUTCMonth() == today.getMonth()) {
                      todayHolidays.push(effectHoliday);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in parsing holidays: ", error);
    }

    return todayHolidays;
  },

  socketNotificationReceived: function (notification, payload) {
    try {
      if (notification === "API-Received" && payload.url === this.url) {
        this.weatherLoaded = true;
        if (!payload.success) {
          console.error("[MMM-DynamicWeather] API-Receieved failure status");
          return;
        }
        let newCode = payload.result.weather[0].id;
        
        let doUpdate = false;

        //check to see if the newCode is different than already displayed, and if so, is it going to show anything
        if (newCode != this.weatherCode) {
          this.weatherCode = newCode;
          if (newCode >= 600 && newCode <= 622 && !this.config.hideSnow) {
            doUpdate = true;
          }
          if ((newCode >= 200 && newCode <= 531) || (newCode >= 611 && newCode <= 622 && !this.config.hideRain)) {
            doUpdate = true;
          }
          if (newCode >= 200 && newCode <= 232 && !this.config.hideLightning) {
            doUpdate = true;
          }
          if (newCode >= 801 && newCode <= 804 && !this.config.hideClouds) {
            doUpdate = true;
          }
          if (newCode >= 701 && newCode <= 781 && !this.config.hideFog) {
            doUpdate = true;
          }
          if (newCode == 800 && !this.config.hideSun) {
            doUpdate = true;
          }
          (this.allEffects as Effect[]).forEach((effect) => {
            if (effect.getWeatherCode() == newCode || (effect.getMinWeatherCode() <= newCode && effect.getMaxWeatherCode() >= newCode)) {
              doUpdate = true;
              effect.doDisplay = true;
              this.hasWeatherEffectsToDisplay = true;
            }
          });
        }

        //only update the dom if the weather is different (unless holiday or date effects exist and holiday has finished loading)
        if (doUpdate || (this.holidayLoaded && (this.hasDateEffectsToDisplay || this.hasHolidayEffectsToDisplay))) {
          this.doShowEffects = true;
          clearTimeout(this.effectDurationTimeout);
          clearTimeout(this.effectDelayTimeout);
          this.updateDom();
        }
      }
      if (notification === "Holiday-Received") {
        this.holidayLoaded = true;
        if (!payload.success) {
          console.error("[MMM-DynamicWeather] Holiday-Receieved failure status");
          return;
        }
        let doUpdate = false;
        let todayHolidays = [] as string[];
        todayHolidays = this.parseHolidays(payload.result.holidayBody);

        //returned a list of holidays for today, check to see if any effects have the same holiday name, if so display them and update dom
        (this.allEffects as Effect[]).forEach((effect) => {
          todayHolidays.forEach((holidayName) => {
            if (effect.holiday == holidayName) {
              doUpdate = true;
              effect.doDisplay = true;
              this.hasHolidayEffectsToDisplay = true;
            }
          });
        });

        //only update the dom if the effects have a holiday to show today (unless weather and date effects exist and weather has finished loading)
        if (doUpdate || (this.weatherLoaded && (this.hasDateEffectsToDisplay || this.hasWeatherEffectsToDisplay))) {
          this.doShowEffects = true;
          clearTimeout(this.effectDurationTimeout);
          clearTimeout(this.effectDelayTimeout);
          this.updateDom();
        }
      }
    } catch (error) {
      console.error("[MMM-DynamicWeather] Error occured in notification received: ", error);
    }
  },
});
