# MMM DynamicWeather Control Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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
