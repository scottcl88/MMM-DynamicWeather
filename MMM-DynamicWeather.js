var Effect = /** @class */ (function () {
    function Effect() {
        this.year = 0;
        this.doDisplay = false;
    }
    Effect.prototype.getYear = function () {
        return this.year ? this.year : 0;
    };
    Effect.prototype.getMonth = function () {
        return this.month ? this.month : 0;
    };
    Effect.prototype.getDay = function () {
        return this.day ? this.day : 0;
    };
    Effect.prototype.getSize = function () {
        return this.size ? this.size : 1;
    };
    Effect.prototype.getWeatherCode = function () {
        return this.weatherCode ? this.weatherCode : -99;
    };
    Effect.prototype.getMinWeatherCode = function () {
        return this.weatherCodeMin ? this.weatherCodeMin : 99999;
    };
    Effect.prototype.getMaxWeatherCode = function () {
        return this.weatherCodeMax ? this.weatherCodeMax : -99999;
    };
    Effect.prototype.hasWeatherCode = function () {
        return (this.weatherCode && this.weatherCode > 0) || (this.weatherCodeMin && this.weatherCodeMin > 0) || (this.weatherCodeMax && this.weatherCodeMax > 0) ? true : false;
    };
    Effect.prototype.hasHoliday = function () {
        return this.holiday && this.holiday.length > 0 ? true : false;
    };
    Effect.prototype.clone = function (other) {
        this.day = other.day;
        this.month = other.month;
        this.year = other.year;
        this.images = other.images;
        this.direction = other.direction;
        this.size = other.size;
        this.weatherCode = other.weatherCode;
        this.weatherCodeMin = other.weatherCodeMin;
        this.weatherCodeMax = other.weatherCodeMax;
        this.holiday = other.holiday;
        this.doDisplay = other.doDisplay;
    };
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
        effectDuration: 120000,
        effectDelay: 60000,
        hideSnow: false,
        hideRain: false,
        hideClouds: false,
        sequential: "",
        effects: [],
    },
    start: function () {
        var _this_1 = this;
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
        this.allEffects = [];
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
        this.allHolidays = [];
        this.config.effects.forEach(function (configEffect) {
            var effect = new Effect();
            effect.clone(configEffect);
            _this_1.allEffects.push(effect);
            _this_1.allHolidays.push(effect.holiday);
        });
        if (this.config.sequential) {
            if (this.config.sequential == "effect") {
                this.lastSequential = "weather";
            }
            else if (this.config.sequential == "weather") {
                this.lastSequential = "effect";
            }
            else {
                this.lastSequential = "";
            }
        }
        else {
            this.lastSequential = "";
        }
        this.checkDates();
        if (this.allHolidays.length > 0) {
            this.getHolidays(this);
        }
        else {
            this.holidayLoaded = true;
        }
        if (!this.config.alwaysDisplay) {
            this.getWeather(this);
        }
        else {
            this.weatherLoaded = true;
        }
    },
    getStyles: function () {
        return ["MMM-DynamicWeather.css"];
    },
    checkDates: function () {
        var _this_1 = this;
        this.allEffects.forEach(function (effect) {
            var effectMonth = effect.month - 1;
            if (!effect.hasWeatherCode() && !effect.hasHoliday()) {
                console.log("Checking effect date: ", effect.getMonth(), effect.getDay(), effect.getYear(), _this_1.now.getMonth(), _this_1.now.getDate(), _this_1.now.getFullYear());
                //if there is weatherCode or holiday, dates are ignored
                if (effect.getMonth() == 0 && effect.getDay() == 0 && effect.getYear() == 0) {
                    //if no weatherCode, no holiday and no dates, then always display it
                    effect.doDisplay = true;
                }
                else if (_this_1.now.getMonth() == effectMonth && _this_1.now.getDate() == effect.day) {
                    if (effect.getYear() == 0 || _this_1.now.getFullYear() == effect.getYear()) {
                        console.log("Effect marked to display");
                        //if the month and date match or the month, date and year match
                        _this_1.hasDateEffectsToDisplay = true;
                        effect.doDisplay = true;
                    }
                }
            }
        });
    },
    getDom: function () {
        var _this_1 = this;
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.zIndex = this.config.zIndex;
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
        console.log("GetDom 1: ", this.weatherLoaded, this.holidayLoaded);
        if (!this.weatherLoaded || !this.holidayLoaded)
            return wrapper; //need to wait for the weather to first be loaded
        console.log("GetDom 2: ", this.doShowEffects, this.weatherCode);
        if (!this.doShowEffects)
            return wrapper;
        var showEffects = false;
        var showWeather = false;
        if (this.hasDateEffectsToDisplay || this.hasHolidayEffectsToDisplay || this.hasWeatherEffectsToDisplay) {
            if (this.lastSequential == "effect") {
                showWeather = true;
                this.lastSequential = "weather";
            }
            else if (this.lastSequential == "weather") {
                showEffects = true;
                this.lastSequential = "effect";
            }
            else {
                showWeather = true;
                showEffects = true;
            }
        }
        if (showEffects) {
            this.allEffects.forEach(function (effect) {
                if (effect.doDisplay) {
                    console.log("Effect is going to display...");
                    _this_1.showCustomEffect(wrapper, effect);
                }
            });
        }
        if (showWeather) {
            //Codes from https://openweathermap.org/weather-conditions
            if (this.weatherCode >= 600 && this.weatherCode <= 622 && !this.config.hideSnow) {
                this.showCustomEffect(wrapper, this.snowEffect);
            }
            else if (this.weatherCode >= 200 && this.weatherCode <= 531 && !this.config.hideRain) {
                this.makeItRain(wrapper);
            }
            else if (this.weatherCode >= 801 && this.weatherCode <= 804 && !this.config.hideClouds) {
                this.makeItCloudy(wrapper);
            }
        }
        console.log("Going to wait for: ", this.config.effectDuration);
        this.effectDurationTimeout = setTimeout(this.stopEffect, this.config.effectDuration, this, wrapper);
        return wrapper;
    },
    showCustomEffect: function (wrapper, effect) {
        this.doShowEffects = false;
        var flake, jiggle, size;
        for (var i = 0; i < this.config.particleCount; i++) {
            size = effect.size; // * (Math.random() * 0.75) + 0.25;
            var flakeImage = document.createElement("div");
            var maxNum = effect.images.length;
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
                    flake.style.left = "-50px";
                    flake.style.top = Math.random() * 100 - 10 + "%";
                    flake.style.animationName = "flake-jiggle-left-right";
                    break;
                }
                case "right-left": {
                    flake.className = "flake-right-left";
                    flake.style.right = "-50px";
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
            jiggle = document.createElement("div");
            jiggle.style.animationDelay = Math.random() * 4 + "s";
            jiggle.style.animationDuration = Math.random() * 30 + 30 + "s";
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
    },
    makeItCloudy: function (wrapper) {
        this.doShowEffects = false;
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
    },
    stopEffect: function (_this, wrapper) {
        //clear elements
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        _this.updateDom();
        var delay = _this.config.effectDelay;
        console.log("Stopped effect, waiting for: ", delay);
        _this.effectDelayTimeout = setTimeout(function (_that, _effect) {
            console.log("Resetting effect to display again");
            _that.doShowEffects = true;
            _that.updateDom();
        }, delay, _this);
    },
    getWeather: function (_this) {
        console.log("Fetching current weather");
        _this.sendSocketNotification("API-Fetch", _this.url);
        _this.weatherTimeout = setTimeout(_this.getWeather, _this.config.weatherInterval, _this);
    },
    getHolidays: function (_this) {
        console.log("Fetching holidays");
        _this.sendSocketNotification("Holiday-Fetch", {});
        _this.holidayTimeout = setTimeout(_this.getHolidays, 1000 * 60 * 60 * 24, _this); //once a day
    },
    parseHolidays: function (body) {
        var today = new Date();
        var todayHolidays = [];
        console.log("Parsing holidays...");
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
                                    console.log("Found effect holiday");
                                    var holidayDate = new Date(parseInt(holidayDateStr));
                                    console.log("Holiday date: ", holidayDate, holidayDate.getUTCDate(), today.getDate(), holidayDate.getUTCMonth(), today.getMonth());
                                    if (holidayDate.getUTCDate() == today.getDate() && holidayDate.getUTCMonth() == today.getMonth()) {
                                        console.log("Effect holiday added: ", effectHoliday);
                                        todayHolidays.push(effectHoliday);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return todayHolidays;
    },
    socketNotificationReceived: function (notification, payload) {
        var _this_1 = this;
        if (notification === "API-Received" && payload.url === this.url) {
            this.weatherLoaded = true;
            if (!payload.success) {
                console.error("API-Receieved failure status");
                return;
            }
            var newCode_1 = payload.result.weather[0].id;
            var doUpdate_1 = false;
            //check to see if the newCode is different than already displayed, and if so, is it going to show anything
            if (newCode_1 != this.weatherCode) {
                if (newCode_1 >= 600 && newCode_1 <= 622 && !this.config.hideSnow) {
                    doUpdate_1 = true;
                }
                if (newCode_1 >= 200 && newCode_1 <= 531 && !this.config.hideRain) {
                    doUpdate_1 = true;
                }
                if (newCode_1 >= 801 && newCode_1 <= 804 && !this.config.hideClouds) {
                    doUpdate_1 = true;
                }
                this.allEffects.forEach(function (effect) {
                    console.log("Checking weather code for effect: ", newCode_1, effect.getWeatherCode(), effect.getMinWeatherCode(), effect.getMaxWeatherCode());
                    if (effect.getWeatherCode() == newCode_1 || (effect.getMinWeatherCode() <= newCode_1 && effect.getMaxWeatherCode() >= newCode_1)) {
                        console.log("Weather codes matched");
                        doUpdate_1 = true;
                        effect.doDisplay = true;
                        _this_1.hasWeatherEffectsToDisplay = true;
                    }
                });
            }
            //only update the dom if the weather is different (unless holiday or date effects exist and holiday has finished loading)
            if (doUpdate_1 || (this.holidayLoaded && (this.hasDateEffectsToDisplay || this.hasHolidayEffectsToDisplay))) {
                this.weatherCode = newCode_1;
                this.doShowEffects = true;
                clearTimeout(this.effectDurationTimeout);
                clearTimeout(this.effectDelayTimeout);
                this.updateDom();
            }
        }
        if (notification === "Holiday-Received") {
            this.holidayLoaded = true;
            if (!payload.success) {
                console.error("Holiday-Receieved failure status");
                return;
            }
            var doUpdate_2 = false;
            var todayHolidays_1 = [];
            todayHolidays_1 = this.parseHolidays(payload.result.holidayBody);
            console.log("Parsing holidays finished with results: ", todayHolidays_1.length);
            //returned a list of holidays for today, check to see if any effects have the same holiday name, if so display them and update dom
            this.allEffects.forEach(function (effect) {
                todayHolidays_1.forEach(function (holidayName) {
                    if (effect.holiday == holidayName) {
                        console.log("Marking effect for holiday: ", holidayName);
                        doUpdate_2 = true;
                        effect.doDisplay = true;
                        _this_1.hasHolidayEffectsToDisplay = true;
                    }
                });
            });
            //only update the dom if the effects have a holiday to show today (unless weather and date effects exist and weather has finished loading)
            if (doUpdate_2 || (this.weatherLoaded && (this.hasDateEffectsToDisplay || this.hasWeatherEffectsToDisplay))) {
                this.doShowEffects = true;
                clearTimeout(this.effectDurationTimeout);
                clearTimeout(this.effectDelayTimeout);
                this.updateDom();
            }
        }
    },
});
