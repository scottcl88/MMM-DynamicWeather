# Module: MMM-DynamicWeather

<p align="center">
  <a href="https://github.com/scottcl88/MMM-DynamicWeather"><img src="https://img.shields.io/maintenance/yes/2024?style=flat-square" alt="Maintained"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://github.com/MagicMirrorOrg/MagicMirror"><img src="https://img.shields.io/badge/module%20of-Magic%20Mirror-%234f46e5?style=flat-square" alt="Part of Magic Mirror"/></a>
  <a href="https://www.npmjs.com/package/mmm-dynamicweather"><img src="https://img.shields.io/npm/v/mmm-dynamicweather" alt="npm package mmm-dynamicweather"/></a>
</p>

A heavily configurable MagicMirror Module to display different animations based on current weather and show customized event effects.

## Features
- Display clouds, rain, sun based on real-time weather in your city
- Display custom images on specific days, such as hearts on Valentine's day
- Plenty of customization options to weather and events

See [Sample Screenshots](ExampleScreenshots.md)

## Installation

In your terminal, go to your MagicMirror's Module folder:

````
cd ~/MagicMirror/modules
````

Clone this repository:

````
git clone https://github.com/scottcl88/MMM-DynamicWeather.git
````

**Note:** After starting the Mirror, it may take a few seconds to startup.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file.

This module comes with many features that are heavily configurable. At it's core, it uses [OpenWeatherMap](https://openweathermap.org/)'s API to get your current weather data to display effects on the screen.

You will need 2 things to get started:
  1. A free API key from OpenWeatherMap - [Sign up here](https://home.openweathermap.org/users/sign_up)
     -  You only need access to the [Current Weather Api](https://openweathermap.org/current)
  3. The LocationID (City ID) - [follow these instructions ](https://www.dmopress.com/openweathermap-howto/)
     - Optionally you can use `lat` (latitude) and `lon` (longitude) of the location you want

This is the basic starting template, using Washington, D.C.'s location. For more examples, see [Example Configurations](ExampleConfigurations.md).

````javascript
{
 module: "MMM-DynamicWeather",
 position: "fullscreen_above",
 config: { // See https://github.com/scottcl88/MMM-DynamicWeather for more information.
  api_key: "your_key",
  locationID: "4140963"
 }
},
````
OR with `lat` and `lon`
````javascript
{
 module: "MMM-DynamicWeather",
 position: "fullscreen_above",
 config: { // See https://github.com/scottcl88/MMM-DynamicWeather for more information.
  api_key: "your_key",
  lat: "38.89511000",
  lon: "-77.03637000"
 }
},
````

## Updating

Go to the DynamicWeather module

````
cd ~/MagicMirror/modules/MMM-DynamicWeather
````

Pull latest

````
git pull origin master --allow-unrelated-histories
````

## Configuration
See [Configuration Options](ConfigurationOptions.md)

## Troubleshooting
See [Troubleshooting Wiki](https://github.com/scottcl88/MMM-DynamicWeather/wiki/Troubleshooting)

## Contributing
See [Contribute Wiki](https://github.com/scottcl88/MMM-DynamicWeather/wiki/Contribute)

## License

See [LICENSE](./LICENSE)
<br>
<br>

Inspired by [MichMich's Snow Plugin](https://github.com/MichMich/MMM-Snow)
