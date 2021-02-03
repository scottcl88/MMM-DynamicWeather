# MMM DynamicWeather Control Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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
