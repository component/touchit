
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(mod.exports, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , index = path + '/index.js';

  return require.modules[reg] && reg
    || require.modules[index] && index
    || require.modules[orig] && orig
    || null;
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  // foo
  if ('.' != path[0]) return path;

  curr = curr.split('/');
  path = path.split('/');

  // ./foo
  if ('.' == path[0]) {
    curr.pop();
    path.shift();
  }

  // ..
  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it doesnt exist');
  require.modules[to] = fn;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {

  /**
   * The relative require() itself.
   */

  function fn(path){
    return require(fn.resolve(path), parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    if ('.' != path[0]) path = './deps/' + path;
    return require.normalize(parent, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};
require.register("touchit/index.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Dispatcher = require('./dispatcher');

/**
 * Expose `bind()`.
 */

module.exports = bind;

/**
 * Bind touch events.
 */

function bind() {
  var dispatcher = new Dispatcher;
  document.addEventListener('mousedown', dispatcher.mousedown.bind(dispatcher), false);
  document.addEventListener('mousemove', dispatcher.mousemove.bind(dispatcher), false);
  document.addEventListener('mouseup', dispatcher.mouseup.bind(dispatcher), false);
  window.ontouchstart = dispatcher.mousedown.bind(dispatcher);
  window.ontouchmove = dispatcher.mousemove.bind(dispatcher);
  window.ontouchend = dispatcher.mouseup.bind(dispatcher); 
}

});
require.register("touchit/touch.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Finger = require('./finger');

/**
 * Expose `Touch`.
 */

module.exports = Touch;

/**
 * Initialize a `Touch` with the given event
 * and `target` element. A `Touch` encapsulates
 * the touch event and `Finger` representation.
 *
 * @param {Event} e
 * @param {Element} target
 * @api private
 */

function Touch(e, target) {
  this.identifier = Date.now() + Math.random();
  this.target = target;
  this.update(e);
  this.finger = new Finger;
}

/**
 * Update properties to match `e`.
 *
 * @param {Event} e
 * @api private
 */

Touch.prototype.update = function(e){
  this.pageX = e.pageX;
  this.pageY = e.pageY;
  this.clientX = e.clientX;
  this.clientY = e.clientY;
  this.screenX = e.screenX;
  this.screenY = e.screenY;
};
});
require.register("touchit/finger.js", function(module, exports, require){

/**
 * Expose `Finger`.
 */

module.exports = Finger;

/**
 * Initialize a new `Finger`.
 *
 * This object represents a single finger,
 * displayed as a gray circle.
 *
 * @api private
 */

function Finger() {
  this.el = document.createElement('div');
  this.el.className = 'touch';
}

/**
 * Show it.
 *
 * @api private
 */

Finger.prototype.show = function(){
  document.body.appendChild(this.el);
};

/**
 * Hide it.
 *
 * @api private
 */

Finger.prototype.hide = function(){
  document.body.removeChild(this.el);
};

/**
 * Move to `(x, y)`.
 *
 * @param {Number} x
 * @param {Number} y
 * @api private
 */

Finger.prototype.moveTo = function(x, y){
  this.el.style.top = y + 'px';
  this.el.style.left = x + 'px';
};
});
require.register("touchit/dispatcher.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Touch = require('./touch');

/**
 * Expose `Dispatcher`.
 */

module.exports = Dispatcher;

/**
 * Initialize a new `Dispatcher`.
 *
 * @api private
 */

function Dispatcher(){}

/**
 * Handle mousedown.
 *
 * @api private
 */

Dispatcher.prototype.mousedown = function(e){
  this.down = e;
  this.emit('touchstart', e);
};

/**
 * Handle mousemove.
 *
 * @api private
 */

Dispatcher.prototype.mousemove = function(e){
  if (!this.down) return;
  this.emit('touchmove', e);
};

/**
 * Handle mouseup.
 *
 * @api private
 */

Dispatcher.prototype.mouseup = function(e){
  this.down = false;
  this.emit('touchend', e);
};

/**
 * Add a `Touch`.
 *
 * @param {Event} e
 * @return {Touch}
 * @api private
 */

Dispatcher.prototype.addTouch = function(e){
  var touch = new Touch(e, this.target);
  this.touches.push(touch);
  touch.finger.show();
  return touch;
};

/**
 * Emit event `type`.
 *
 * Assigns `.two` to a boolean in order to
 * represent two fingers by holding down the
 * alt key.
 *
 * @param {String} type
 * @param {Event} e
 * @api private
 */

Dispatcher.prototype.emit = function(type, e){
  this.target = this.target || e.target;
  this.two = e.altKey;
  var event = createEvent(type, e);
  this[type](event, e);
};

/**
 * Handle touchstart.
 * 
 * @api private
 */

Dispatcher.prototype.touchstart = function(event, e){
  this.touches = [];

  // one finger
  this.addTouch(e);

  // two fingers
  if (this.two) {
    var touch = this.addTouch(e);
    touch.pageX = e.pageX - 50;
    touch.pageY = e.pageY + 50;
  }

  // move
  var one = this.touches[0];
  var two = this.touches[1];
  one.finger.moveTo(e.pageX, e.pageY);
  if (two) two.finger.moveTo(touch.pageX, touch.pageY);

  // dispatch
  event.targetTouches = event.touches = this.touches;
  this.target.dispatchEvent(event);
};

/**
 * Handle touchmove.
 * 
 * @api private
 */

Dispatcher.prototype.touchmove = function(event, e){
  var one = this.touches[0];
  var two = this.touches[1];

  // move
  one.update(e);
  one.finger.moveTo(e.pageX, e.pageY);

  // if (this.two) {
  //   two.update(e);
  //   two.pageX = window.innerWidth - e.pageX;
  //   two.pageY = window.innerHeight - e.pageY;
  //   two.finger.moveTo(two.pageX, two.pageY);
  // }

  // dispatch
  event.changedTouches = event.targetTouches = event.touches = this.touches;
  this.target.dispatchEvent(event);
};

/**
 * Handle touchend.
 * 
 * @api private
 */

Dispatcher.prototype.touchend = function(event, e){
  var target = this.target;
  hideFingers(this.touches);
  event.changedTouches = event.targetTouches = this.touches;
  event.touches = [];
  this.target = this.touches = null;
  target.dispatchEvent(event);
};

/**
 * Create an `MouseEvent` to masquerade as a `TouchEvent`
 * on non-touch devices, given the `type` and original event `e`.
 *
 * @param {String} type
 * @param {MouseEvent} e
 * @return {MouseEvent}
 * @api private
 */

function createEvent(type, e) {
  var event = document.createEvent('MouseEvent');

  event.initMouseEvent(type, true, true, window, e.detail,
    e.screenX, e.screenY, e.clientX, e.clientY,
    e.ctrlKey, e.shiftKey, e.altKey, e.metaKey,
    e.button, e.relatedTarget);

  return event;
}

/**
 * Hide all fingers in `touches`.
 *
 * @param {Array} touches
 * @api private
 */

function hideFingers(touches){
  touches.forEach(function(touch){
    touch.finger.hide();
  });
};

});