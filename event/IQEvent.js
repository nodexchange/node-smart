var IQEvent = function(type) {
  this.type = type;
  this.target = null;
  this.currentTarget = null;
};

IQEvent.prototype.property = function(name, value) {
  if (name != 'type' && name != 'target') {
    this[name] = value;
  }
  return this;
};

IQEvent.HEADERS = {};

// ============= Express ===========================
IQEvent.SERVER = 'server';
IQEvent.MONGOOSE_READY = 'mongooseReady';
IQEvent.EXPRESS_RENDER = 'expressRender';
IQEvent.HEADERS.debug = 'debug';
IQEvent.RENDER = {};
IQEvent.RENDER.DASHBOARD = {};
IQEvent.RENDER.DASHBOARD.HOME = 'render.dashboard.home';
IQEvent.RENDER.DASHBOARD.ACCOUNTS = 'render.dashboard.accounts';
IQEvent.RENDER.DASHBOARD.POSTS = 'render.dashboard.posts';
IQEvent.REQUEST = {};
IQEvent.REQUEST.JSON = {};
IQEvent.REQUEST.JSON.ACCOUNTS = 'request.json.accounts';

module.exports = IQEvent;
