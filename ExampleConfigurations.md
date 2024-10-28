# Example Configurations

Below are helpful configurations for you to get started. See [Configuration Options](ConfigurationOptions.md) for details of each option.

Feel free to contribute to this list.

## Show hearts on Valentine's day + default real-time weather effects

```javascript
{
  module: "MMM-DynamicWeather",
  position: "fullscreen_above",
  config: { // See https://github.com/scottcl88/MMM-DynamicWeather for more information.
    api_key: "your_key",
    lat: "38.89511000",
    lon: "-77.03637000",
    effects: [
      {
        month: "2",
        day: "14",
        images: ["heart1.png", "heart2.png"],
        direction: "up"
      }
    ],
  }
},
```

## Never show the clouds + default real-time weather effects

```javascript
{
  module: "MMM-DynamicWeather",
  position: "fullscreen_above",
  config: { // See https://github.com/scottcl88/MMM-DynamicWeather for more information.
    api_key: "your_key",
    lat: "38.89511000",
    lon: "-77.03637000",
    hideClouds: true
  }
},
```

## Always show the sun + default real-time weather effects

```javascript
{
  module: "MMM-DynamicWeather",
  position: "fullscreen_above",
  config: { // See https://github.com/scottcl88/MMM-DynamicWeather for more information.
    api_key: "your_key",
    lat: "38.89511000",
    lon: "-77.03637000",
    alwaysDisplay: "sun"
  }
},
```
