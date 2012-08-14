
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
