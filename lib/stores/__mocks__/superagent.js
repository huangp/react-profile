var json = require('../userStats.json');

var RequestMock = {};

RequestMock._mockResponse = {};
var _set = {};

function get(getUrl) {
  this._get = getUrl;
  return this;
}

function set(name, value) {
  _set[name] = value;
  return this;
}

function end(func) {
  func.call(this, {error: false, body: json});
}

RequestMock.get = get;
RequestMock.set = set;
RequestMock.end = end;

module.exports = RequestMock;
