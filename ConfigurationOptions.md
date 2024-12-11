
## Configuration options

The following properties can be configured:

|Option|Description|
|---|---|
|`alwaysDisplay`|Set this to always display the specified default effect, regardless of weather. Does not work for custom effects; to always display custom effects leave out weatherCode, month, day and year.<br><br>**Options:** `cloudy`, `fog`, `lightning`, `rain-lightning`, `rain`, `sun`, `moon`, `snow` <br>**Type:** `string`<br>**Default value:** `null`|
|`api_key`|**Required** This is the API key you need to use to request weather data from the OpenWeatherMap site.  Details on how to request an API key can be found [here](https://home.openweathermap.org/users/sign_up)<br><br>**Type:** `string`<br>**Default value:** `null`|
|`effectDuration`|The length, in milliseconds, to display the effect. <br><br>**Type:** `number`<br>**Default value:** `120000`|
|`effectDelay`|The length, in milliseconds, to wait to restart the effect. <br><br>**Type:** `number`<br>**Default value:** `60000`|
|`fadeDuration`|The length, in milliseconds, to fade out all effects. <br><br>**Type:** `number`<br>**Default value:** `3000`|
|`hideSnow`|If true, will never display the "snow" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideSnowman`|If false, will display an animation at the bottom of a snowman being built if the current weather is snow and `hideSnow` is false. The animation lasts for the effectDuration with a 10 second delay.<br><br>**Type:** `boolean`<br>**Default value:** `true`|
|`hideRain`|If true, will never display the "rain" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideFlower`|If false, will display an animation at the bottom of a flower growing if the current weather is rain and `hideRain` is false. The animation lasts for the effectDuration with a 10 second delay. <br><br>**Type:** `boolean`<br>**Default value:** `true`|
|`hideClouds`|If true, will never display the "cloudy" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideFog`|If true, will never display the "fog" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideLightning`|If true, will never display the "lightning" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideSun`|If true, will never display the "sun" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideMoon`|If true, will never display the "moon" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`lightning1Count`|Sets how many times the lightning1.png image will be displayed during the effect duration if current weather is thunderstorm.<br><br>**Type:** `number`<br>**Default value:** `2`|
|`lightning2Count`|Sets how many times the lightning2.png image will be displayed during the effect duration if current weather is thunderstorm.<br><br>**Type:** `number`<br>**Default value:** `3`|
|`locationID`|**Required (or use lat/lon)** The locationID from OpenWeatherMap for your city to get current weather. [Follow steps here to find city ID](https://www.dmopress.com/openweathermap-howto/) <br><br>**Type:** `integer`<br>**Default value:** `0`|
|`lat`|**Required with lon (or use locationID)** This is the latitude of the location you want to get the weather for.<br><br>**Type:** `number`<br>**Default value:** `0.0`|
|`lon`|**Required with lat (or use locationID)** This is the longitude of the location you want to get the weather for.<br><br>**Type:** `number`<br>**Default value:** `0.0`|
|`particleCount`|The number of particles to show for each effect. Higher counts may cause performance issues. This can be overriden in each effect. <br><br>**Type:** `integer`<br>**Default value:** `100`|
|`realisticClouds`|If true, shows more realistic cloud effect. Uses the cloud pictures with varying size and amount based on current weather cloud density.<br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`sequential`|If set, will not display weather and a custom effect at the same time. It will run for effectDuration, wait for effectDelay, and then show the next. Repeats until either the weather changes and/or the effect date/holiday is no longer today. If not set, both weather and effect can be seen together. <br><br>`weather` to see weather first <br> `effect` to see effect first <br> `effect-one` to see effect first but only 1 effect at a time, going in order of the array. <br><br><br>**Options:**`weather`,`effect`,`effect-one`<br>**Type:** `string`<br>**Default value:** `null`|
|`sunImage`|Determines which image to display when sunny.<br><br>**Options:**`sun_center`,`sun_large`,`sun_left`,`sun_right`<br>**Type:** `string`<br>**Default value:** `sun_right`|
|`weatherInterval`|How often the weather is updated.<br><br>**Type:** `integer`<br>**Default value:** `600000 // 10 minutes`|
|`opacity`|Sets the opacity of the module's wrapper. Use a value between `0.1` and `1`. <br><br>**Type:** `number`<br>**Default value:** `1`|

### Effect options

|Option|Description|
|---|---|
|`direction`|How the effect moves across the screen.<br><br>**Options:** `up`, `down`, `right-left`, `left-right`<br>**Type:** `string`<br>**Default value:** `up`|
|`dateRange`|An array of date ranges in the format "YYYY-MM-DD to YYYY-MM-DD" (inclusive)<br><br>**Type:** `string[]`<br>**Default value:** `null`|
|`month`|The month (1-12) of the date to display this effect on. Must not set weatherCode or holiday.<br><br>**Type:** `number`<br>**Default value:** `0`|
|`day`|The day of the month (1-31) of the date to display this effect on.  Must not set weatherCode or holiday.<br><br>**Type:** `number`<br>**Default value:** `0`|
|`year`|The year (4 digits) of the date to display this effect on. You can leave it out or set to zero to ignore the year and it will just check month and date. If you want to use dates, then you must not set weatherCode or holiday.<br><br>**Type:** `number`<br>**Default value:** `0`|
|`holiday`|Will display the effect on the holiday found at [https://www.timeanddate.com/holidays/us/?hol=43122559](https://www.timeanddate.com/holidays/us/?hol=43122559). Simply copy the "Name" value from that table. <br><br>**Type:** `string`<br>**Default value:** `null`|
|`images`|An array of image files to display at random for this effect. All files need to be in the "images" folder of the MMM-DynamicWeather module folder.<br><br>**Type:** `string[]`<br>**Default value:** `null`|
|`particleCount`|The number of particles to show for the effect. Higher counts may cause performance issues. If this is not set, it will use the `particleCount` from the general configuration. <br><br>**Type:** `integer`<br>**Default value:** `null`|
|`maxSpeed`|The maximum speed, in seconds, for the effect's image to cross the screen. Closer to zero is faster. Each effect particle is randomized between maxSpeed and minSpeed. <br><br>**Type:** `number`<br>**Default value:** `100`|
|`minSpeed`|The minimum speed, in seconds, for the effect's image to cross the screen. Closer to zero is faster. Each effect particle is randomized between maxSpeed and minSpeed.  <br><br>**Type:** `number`<br>**Default value:** `50`|
|`recurrence`|Display the effect repeatedly.<br>Yearly - Not a recurrence option, just leave year unset or zero.<br><br>**Options:**`monthly`,`weekly`,`weekdays`,`weekends`<br>**Type:** `string`<br>**Default value:** `null`|
|`size`|The size factor to display the image; larger the number the larger the picture.<br><br>**Type:** `number`<br>**Default value:** `1`|
|`weatherCode`|The effect will be displayed whenever the current weather matches this code. You can find all valid codes [here](https://openweathermap.org/weather-conditions)<br>This does not change the default weather effects, those will still be shown unless the specific weather condition is turned off. <br><br>**Type:** `number`<br>**Default value:** `0`|
|`weatherCodeMin`|Similar to `weatherCode` but will show the effect if the current weather code is greater or equal to this value. <br><br>**Type:** `number`<br>**Default value:** `0`|
|`weatherCodeMax`|Similar to `weatherCode` but will show the effect if the current weather code is less than or equal to this value. <br><br>**Type:** `number`<br>**Default value:** `0`|
