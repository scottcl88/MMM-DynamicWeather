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

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-DynamicWeather',
		position: 'fullscreen_above',
		config: { // See 'Configuration options' for more information.
			api_key: "your_key",
			lat: "38.907192",
			lon: "-77.036873"
		}
	}
]
````

## Configuration options

The following properties can be configured:

|Option|Description|
|---|---|
|`api_key`|**Required** This is the API key you need to use to request weather data from the WeatherBit site.  Details on how to request an API key can be found [here](https://www.weatherbit.io/account/create)<br><br>**Type:** `string`<br>**Default value:** `null`|
|`lat`|This is the latitude of the location you want to get the weather for.<br><br>**Type:** `number`<br>**Default value:** `0.0`|
|`lon`|This is the longitude of the location you want to get the weather for.<br><br>**Type:** `number`<br>**Default value:** `0.0`|
|`interval`|How often the weather is updated.<br><br>**Type:** `integer`<br>**Default value:** `600000 // 10 minutes`|
|`particleCount`|The number of particles to show for each effect. Higher counts may cause performance issues.<br><br>**Type:** `integer`<br>**Default value:** `100`|
|`alwaysDisplay`|Set this to always display the specified effect.<br><br>**Options:** `love`, `snow`, `rain`, `cloudy`<br>**Type:** `string`<br>**Default value:** `null`|
|`zIndex`|Sets the z-index of the module's wrapper, in case of other elements being blocked.<br><br>**Type:** `number`<br>**Default value:** `99`|
