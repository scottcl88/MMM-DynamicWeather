# MMM DynamicWeather Control Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

Wintermix, realistic clouds and effect particle count

## [2.11.0] - 2021-02-19
### Added
- Winter mix weather effect to show snow and rain at sametime based on current weather
- Added realisticClouds option (added to configuration)
- Added particleCount for each effect (added to configuration)

## [2.10.0] - 2021-02-19
### Added
- Added lightning effect for weather conditions. Added to alwaysDisplay option and hideLightning option. (added to configuration)

## [2.9.0] - 2021-02-18
### Added
- Add min and max speed to effects

## [2.8.0] - 2021-02-18
### Added
- Adding effect-one option for sequential

## [2.7.2] - 2021-02-18
### Fixed
- Fixed issue with sequential taking twice as long and holiday not being removed the next day

## [2.7.1] - 2021-02-05
### Changes
- Cleaned up code, removed unncessary comments and logs, formats, renamed example files
- Updated module description

## [2.7.0] - 2021-02-05
### Added
- Added fog weather effect (added to configuration)

## [2.6.1] - 2021-02-05
### Fixed
- Issue with larger images getting cut off has been resovled by changing background to "contain", which will not keep ratio of image

## [2.6.0] - 2021-02-05
### Added
- Adding fade duration to slowing hide effects (added to configuration)

## [2.5.0] - 2021-02-05
### Added
- Adding recurrence option for effects (added to effect configuration)

## [2.4.1] - 2021-02-04
### Added
- Adding sequential option (added to configuration)

## [2.3.0] - 2021-02-04
### Added
- Adding min and max weatherCode for effects (added to effect configuration)

## [2.2.1] - 2021-02-04
### Added
- Adding Right-Left and Left-Right Directions (added to effect configuration)

## [2.1.3] - 2021-02-04
### Fixed
- Minor bugfix where effects don't show with no year and no holidays

## [2.1.0] - 2021-02-04
### Added
- Holidays to effects so that they display on a specific holiday date (added to effect configuration)

### Changed
- Forced weather and holiday requests to finish before display effects

### Fixed
- Issue with effectDelay not working
- Issue with weather API being called multiple times
- Failed requests from weather will no longer break module

## [2.0.2] - 2021-02-04
### Fixed
- Minor issue with effects not being displayed on their date

## [2.0.1] - 2021-02-03
### Fixed
- Minor issue with effects not having weather code causing them to always display despite having a date

## [2.0.0] - 2021-02-03
### Added
- Changelog
- Custom effects
- Configuration changes:
   - `locationID` - to work with OpenWeatherMap city IDs
   - `effectDuration` - to display effects for X time
   - `effectDelay` - to wait X time for effects to restart
   - `hideSnow`, `hideRain`, `hideClouds` - to never display certain weather effects
- Added TypeScript

### Changed
- Configuration changes:
   - `interval` renamed to `weatherInterval`
- Weather API changed to use Open Weather Map

## [1.0.0] - 2021-02-02
### Initial release of the DynamicWeather module.
