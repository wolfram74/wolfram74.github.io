var iterator = function(cycles, callback, delay){
  delay = delay || 0
  if(cycles > 0){
    setTimeout(
      function(){
        callback();
        iterator(cycles-1, callback, delay)
      },
      delay)
  }
}

var canvasSetup = function(canvasName){
  var $canvas = $('<canvas width=400px height=400px>')
  $canvas.attr('id', canvasName)
  return $canvas
}
