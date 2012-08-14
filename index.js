
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
