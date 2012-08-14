
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