var Effect = /** @class */ (function () {
    function Effect() {
        this.year = 0;
    }
    return Effect;
}());
Module.register("MMM-DynamicWeather", {
    defaults: {
        particleCount: 100,
        api_key: "",
        locationID: 0,
        lat: 0,
        lon: 0,
        weatherInterval: 600000,
        alwaysDisplay: "",
        zIndex: 99,
        weatherDuration: 120000,
        weatherDelay: 60000,
        effects: [
            {
                month: 2,
                day: 3,
                year: 0,
                duration: 60000,
                delay: 30000,
                images: ["heart1.png", "heart2.png"],
                direction: "up",
                size: 2,
            },
        ],
    },
    start: function () {
        this.now = new Date();
        this.initialized = false;
        this.loaded = false;
        this.doShowCustomEffects = true;
        this.doShowWeatherEffects = true;
        this.url =
            "https://api.openweathermap.org/data/2.5/weather?appid=" +
                this.config.api_key;
        if (this.config.lat && this.config.lon) {
            this.url += "&lat=" + this.config.lat + "&lon=" + this.config.lon;
        }
        if (this.config.locationID) {
            this.url += "&id=" + this.config.locationID;
        }
        this.weatherCode = 0;
        if (!this.config.alwaysDisplay) {
            this.getWeatherAPI(this);
        }
    },
    getStyles: function () {
        return ["MMM-DynamicWeather.css"];
    },
    getDom: function () {
        var _this_1 = this;
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.zIndex = this.config.zIndex;
        var snowEffect = new Effect();
        snowEffect.images = ["snow1.png", "snow2.png", "snow3.png"];
        snowEffect.size = 1;
        snowEffect.direction = "down";
        snowEffect.isWeather = true;
        snowEffect.duration = this.config.weatherDuration;
        snowEffect.delay = this.config.weatherDelay;
        if (this.config.alwaysDisplay) {
            switch (this.config.alwaysDisplay) {
                case "love": {
                    var loveEffect = new Effect();
                    loveEffect.images = ["heart1.png", "heart2.png"];
                    loveEffect.size = 2;
                    loveEffect.direction = "up";
                    loveEffect.duration = this.config.weatherDuration;
                    loveEffect.delay = this.config.weatherDelay;
                    this.showCustomEffect(wrapper, loveEffect);
                    break;
                }
                case "snow": {
                    this.showCustomEffect(wrapper, snowEffect);
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
        if (this.doShowCustomEffects) {
            this.config.effects.forEach(function (effect) {
                var effectMonth = effect.month - 1;
                if (_this_1.now.getMonth() == effectMonth &&
                    _this_1.now.getDate() == effect.day) {
                    if (effect.year == 0 || _this_1.now.getYear() == effect.year) {
                        _this_1.showCustomEffect(wrapper, effect);
                    }
                }
            });
        }
        if (this.doShowWeatherEffects) {
            //Codes from https://openweathermap.org/weather-conditions
            if (this.weatherCode >= 600 && this.weatherCode <= 622) {
                this.showCustomEffect(wrapper, snowEffect);
            }
            else if (this.weatherCode >= 200 && this.weatherCode <= 531) {
                this.makeItRain(wrapper);
            }
            else if (this.weatherCode >= 801 && this.weatherCode <= 804) {
                this.makeItCloudy(wrapper);
            }
        }
        return wrapper;
    },
    showCustomEffect: function (wrapper, effect) {
        if (effect.isWeather) {
            this.doShowWeatherEffects = false;
        }
        else {
            this.doShowCustomEffects = false;
        }
        var flake, jiggle, size;
        for (var i = 0; i < this.config.particleCount; i++) {
            size = effect.size * (Math.random() * 0.75) + 0.25;
            var flakeImage = document.createElement("div");
            var maxNum = effect.images.length;
            var picIndex = Math.floor(Math.random() * (maxNum - 0) + 0);
            flakeImage.style.backgroundImage =
                "url('./modules/MMM-DynamicWeather/images/" +
                    effect.images[picIndex] +
                    "')";
            flakeImage.style.transform = "scale(" + size + ", " + size + ")";
            flakeImage.style.opacity = size;
            flake = document.createElement("div");
            if (effect.direction == "down") {
                flake.className = "flake-downwards";
            }
            else {
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
            var frontDrop = document.createElement("div");
            frontDrop.classList.add("drop");
            frontDrop.style.left = increment + "%";
            frontDrop.style.bottom = randoFiver + randoFiver - 1 + 100 + "%";
            frontDrop.style.animationDelay = "1." + randoHundo + "s";
            frontDrop.style.animationDuration = "1.5" + randoHundo + "s";
            var frontStem = document.createElement("div");
            frontStem.classList.add("stem");
            frontStem.style.animationDelay = "1." + randoHundo + "s";
            frontStem.style.animationDuration = "1.5" + randoHundo + "s";
            frontDrop.appendChild(frontStem);
            var backDrop = document.createElement("div");
            backDrop.classList.add("drop");
            backDrop.style.opacity = "0.5";
            backDrop.style.right = increment + "%";
            backDrop.style.bottom = randoFiver + randoFiver - 1 + 100 + "%";
            backDrop.style.animationDelay = "1." + randoHundo + "s";
            backDrop.style.animationDuration = "1.5" + randoHundo + "s";
            var backStem = document.createElement("div");
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
            var cloudBase = document.createElement("div");
            cloudBase.style.animation = "animateCloud " + speed + "s linear infinite";
            cloudBase.style.transform = "scale(0." + size + ")";
            var cloud = document.createElement("div");
            cloud.classList.add("cloud");
            cloudBase.appendChild(cloud);
            wrapper.appendChild(cloudBase);
        }
        var cloudEffect = new Effect();
        cloudEffect.isWeather = true;
        setTimeout(this.stopEffect, this.config.weatherDuration, this, wrapper, cloudEffect);
    },
    stopEffect: function (_this, wrapper, effect) {
        //clear elements
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        _this.updateDom();
        var delay = effect.isWeather ? _this.config.weatherDelay : effect.delay;
        setTimeout(function (_that, _effect) {
            if (_effect.isWeather) {
                _that.doShowWeatherEffects = true;
            }
            else {
                _that.doShowCustomEffects = true;
            }
            _that.updateDom();
        }, delay, _this, effect);
    },
    restartEffect: function (_this) {
        _this.doShowCustomEffects = false;
        _this.updateDom();
    },
    getWeatherAPI: function (_this) {
        _this.sendSocketNotification("API-Fetch", _this.url);
        setTimeout(_this.getWeatherData, _this.config.interval, _this);
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "API-Received" && payload.url === this.url) {
            this.loaded = true;
            this.weatherCode = payload.result.weather[0].id;
            this.updateDom();
        }
    },
});
