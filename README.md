# Module: MMM-DynamicWeather

A heavily configurable MagicMirror Module to display different animations based on current weather and show customized event effects.
<br>
<br>
Inspired by [MichMich's Snow Plugin](https://github.com/MichMich/MMM-Snow)

## Sample Screenshots
### [Sample Screenshots](ExampleScreenshots.md)

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

**Note:** After starting the Mirror, it may take a few seconds to startup.

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
You can also use the NPM package: <https://www.npmjs.com/package/mmm-dynamicweather>

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
### [Configuration Options](ConfigurationOptions.md)

