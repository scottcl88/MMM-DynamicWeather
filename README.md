# Module: MMM-DynamicWeather
Inspired by [MichMich's Snow Plugin](https://github.com/MichMich/MMM-Snow) I added rain and clouds as well as automatically toggling the effects based on the current weather and date.

**Rain**

![](rain.png)

**Cloudy**

![](cloudy.png)

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/scottcl88/MMM-DynamicWeather.git
````

Configure the module in your `config.js` file.

**Note:** After starting the Mirror, it will take a few seconds before any effects may show. If its clear skies, nothing will be seen unless its February 14 (which shows hearts).

## Updating
Go to the DynamicWeather module
````
cd ~/MagicMirror/modules/MMM-DynamicWeather
````
Pull latest
````
git pull origin master --allow-unrelated-histories
````
<br><br>
You can also use the NPM package: https://www.npmjs.com/package/mmm-dynamicweather

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
{
	module: 'MMM-DynamicWeather',
	position: 'fullscreen_above',
	config: { // See https://github.com/scottcl88/MMM-DynamicWeather for more information.
		api_key: "your_key",
		locationID: "4140963",
		effects: [
			{
				month: "2",
				day: "14",
				year: "2021",
				images: ["heart1.png", "heart2.png"],
				direction: "up"
			}
		],
	}
},
````

## Configuration options

The following properties can be configured:

|Option|Description|
|---|---|
|`alwaysDisplay`|Set this to always display the specified default effect, regardless of weather. Does not work for custom effects; to always display custom effects leave out weatherCode, month, day and year.<br><br>**Options:** `snow`, `rain`, `cloudy`<br>**Type:** `string`<br>**Default value:** `null`|
|`api_key`|**Required** This is the API key you need to use to request weather data from the OpenWeatherMap site.  Details on how to request an API key can be found [here](https://home.openweathermap.org/users/sign_up)<br><br>**Type:** `string`<br>**Default value:** `null`|
|`effectDuration`|The length, in milliseconds, to display the effect. <br><br>**Type:** `number`<br>**Default value:** `120000`|
|`effectDelay`|The length, in milliseconds, to wait to restart the effect. <br><br>**Type:** `number`<br>**Default value:** `60000`|
|`hideSnow`|If true, will never display the "snow" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideRain`|If true, will never display the "rain" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`hideClouds`|If true, will never display the "cloudy" effect. <br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`locationID`|**Required (or use lat/lon)** The locationID from OpenWeatherMap for your city to get current weather. [Follow steps here to find city ID](https://www.dmopress.com/openweathermap-howto/) <br><br>**Type:** `integer`<br>**Default value:** `0`|
|`lat`|**Required with lon (or use locationID)** This is the latitude of the location you want to get the weather for.<br><br>**Type:** `number`<br>**Default value:** `0.0`|
|`lon`|**Required with lat (or use locationID)** This is the longitude of the location you want to get the weather for.<br><br>**Type:** `number`<br>**Default value:** `0.0`|
|`particleCount`|The number of particles to show for each effect. Higher counts may cause performance issues.<br><br>**Type:** `integer`<br>**Default value:** `100`|
|`sequential`|If set, will not display weather and a custom effect at the same time. If not set, both weather and effect can be seen together. Set the value to "weather" if you want to see weather first; weather will run for duration time, then wait for delay time, then show effect. If value is "effect", the effect will be shown first, then weather. Repeats until either the weather changes and/or the effect date/holiday is no longer today. <br><br>**Options:**`weather`,`effect`<br>**Type:** `string`<br>**Default value:** `null`|
|`weatherInterval`|How often the weather is updated.<br><br>**Type:** `integer`<br>**Default value:** `600000 // 10 minutes`|
|`zIndex`|Sets the z-index of the module's wrapper, in case of other elements being blocked.<br><br>**Type:** `number`<br>**Default value:** `99`|

### Effect options
|Option|Description|
|---|---|
|`direction`|How the effect moves across the screen.<br><br><br>**Options:** `up`, `down`, `right-left`, `left-right`<br>**Type:** `string`<br>**Default value:** `up`|
|`month`|The month (1-12) of the date to display this effect on. Must not set weatherCode or holiday.<br><br>**Type:** `number`<br>**Default value:** `0`|
|`day`|The day of the month (1-31) of the date to display this effect on.  Must not set weatherCode or holiday.<br><br>**Type:** `number`<br>**Default value:** `0`|
|`year`|The year (4 digits) of the date to display this effect on. You can leave it out or set to zero to ignore the year and it will just check month and date. If you want to use dates, then you must not set weatherCode or holiday.<br><br>**Type:** `number`<br>**Default value:** `0`|`|
|`holiday`|Will display the effect on the holiday found at [https://www.timeanddate.com/holidays/us/?hol=43122559](https://www.timeanddate.com/holidays/us/?hol=43122559). Simply copy the "Name" value from that table. <br><br>**Type:** `string`<br>**Default value:** `null`|
|`images`|An array of image files to display at random for this effect. All files need to be in the "images" folder of the MMM-DynamicWeather module folder.<br><br>**Type:** `string[]`<br>**Default value:** `null`|
|`recurrence`|Display the effect repeatedly.<br>Yearly - Not a recurrence option, just leave year unset or zero.<br><br>**Options:**`monthly`,`weekly`,`weekdays`,`weekends`<br>**Type:** `number`<br>**Default value:** `1`|
|`size`|The size factor to display the image; larger the number the larger the picture.<br><br>**Type:** `number`<br>**Default value:** `1`|
|`weatherCode`|The effect will be displayed whenever the current weather matches this code. You can find all valid codes [here](https://openweathermap.org/weather-conditions)<br>This does not change the default weather effects, those will still be shown unless `hideSnow`, `hideRain` or `hideClouds` is turned on. <br><br>**Type:** `number`<br>**Default value:** `0`|
|`weatherCodeMin`|Similar to `weatherCode` but will show the effect if the current weather code is greater or equal to this value. <br><br>**Type:** `number`<br>**Default value:** `0`|
|`weatherCodeMax`|Similar to `weatherCode` but will show the effect if the current weather code is less than or equal to this value. <br><br>**Type:** `number`<br>**Default value:** `0`|

