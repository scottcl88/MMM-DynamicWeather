# Module: MMM-DynamicWeather
Inspired by [MichMich's Snow Plugin](https://github.com/MichMich/MMM-Snow) I created a little more realistic snow plugin to improve your winter experience! 

The module supports themes. Current themes are *winter* and *love*. The first one let's it snow while the latter conjurs hearts on your mirror.  

**Screenshot "snowing"**

![](.github/example-winter.png)

**Screenshot "rain

![](.github/example-water.png)

**Screenshot "clouds"**

![](.github/example-water.png)

**Screenshot "Valentine's Day"**

![](.github/example-love.png)

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

**Note:** After starting the Mirror, it will take a few seconds before any effects may show. If its clear skies, nothing will be seen unless its February 14.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-DynamicWeather',
		position: 'fullscreen_above',
		config: { // See 'Configuration options' for more information.
			flakeCount: 100	
		}
	}
]
````

## Configuration options

The following property can be configured:


|Option|Description|
|---|---|
|`flakeCount`|The number of snow flakes. More flakes are havier for the cpu, so don't go wild. <br>**Default value:** `100`|
|`theme`| Defines the type of "flakes". Possible values are `winter`, `love`, and `water`.<br>**Default value:** `winter`|
