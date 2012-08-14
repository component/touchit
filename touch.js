
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
  this.identifier = new Date + Math.random();
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