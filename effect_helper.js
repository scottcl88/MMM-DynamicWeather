/* Magic Mirror
 * Module: MMM-DynamicWeather
 *
 * By Scott Lewis - https://github.com/scottcl88/MMM-DynamicWeather
 * MIT Licensed.
 *
 * Extension helper module to call an API
 */
module.exports = class Effect {
  constructor(name) {
    this.name = name;
    this.scopes = [];
  }
  getName() {
    return this.name;
  }
  getScopes() {
    return this.scopes;
  }
  addScope(scope){
    if (this.scopes.indexOf(scope) === -1) this.scopes.push(scope);
  }
}