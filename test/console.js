
var list = document.getElementById('console');

console = {};

console.log = function(fmt){
  var i = 1;
  var args = arguments;

  fmt = String(fmt).replace(/%s/g, function(){
    return args[i++];
  });

  var msg = document.createElement('li');
  msg.textContent = fmt;
  list.appendChild(msg);
};