$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"],["<mj>","</mj>"]]}
    });
  $('#controls').on('change', 'input', sliderListener)
  staticDraw($('#small-sample-blue'), smallBlue)
  staticDraw($('#small-sample-red'), smallRed)
  staticDraw($('#small-sample-both'), smallBlue)
  staticDraw($('#small-sample-both'), smallRed)
});

var sliderListener = function(event){
  var power = event.target.value
  console.log(1*power)
}

var staticDraw = function($element, points){
  var color = points[0]
  var context = $element[0].getContext('2d')
  context.fillStyle = color
  for(var i=0; i< points[1].length; i++){
    context.beginPath()
    var x_y = points[1][i]
    context.arc(
      x_y[0], x_y[1],
      3, 0, 2*Math.PI)
    context.fill()
    context.closePath()
  }

}
var smallBlue = ['#0000ff',
  [[40,50], [70,80], [40,110], [100,50]] ]
var smallRed = ['#ff0000',
  [[43,50], [74,80], [43,109], [103,51]] ]

