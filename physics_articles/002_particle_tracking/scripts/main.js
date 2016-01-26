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
  staticLines($('#empty-bins'), 20)
  staticLines($('#filled-red-bins'), 20)
  staticDraw($('#filled-red-bins'), smallRed)
  staticLines($('#blue-check-bins'), 20)
  staticDraw($('#blue-check-bins'), smallRed)
  staticDraw($('#blue-check-bins'), ['#0000ff',
  [[70,83]] ] )
  staticHighlight($('#blue-check-bins'), ['rgba(0,0,255,.1',
  [[3,4], [4,4], [2,4], [3,3], [4,3], [2,3], [3,5], [2,5], [4,5]] ] , 20)
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
};

var staticLines = function($element, spacing){
  var height = $element.height()
  var width = $element.width()
  var y_count = height/spacing
  var x_count = width/spacing
  var context = $element[0].getContext('2d')
  context.fillStyle = '#000000'
  for(var i =0; i < x_count; i++){
    context.beginPath()
    context.moveTo(0, i*spacing)
    context.lineTo(width, i*spacing)
    context.stroke()
    context.closePath()
  }
  for(var i =0; i < y_count; i++){
    context.beginPath()
    context.moveTo(i*spacing, 0)
    context.lineTo(i*spacing, height)
    context.stroke()
    context.closePath()
  }
}

var staticHighlight = function($element, squares, spacing){
  var color = squares[0]
  var context = $element[0].getContext('2d')
  context.fillStyle = color
  console.log('higher')
  for(var i=0; i< squares[1].length; i++){
    context.beginPath()
    var x_y = squares[1][i]
    context.fillRect(
      x_y[0]*spacing, x_y[1]*spacing,
      spacing, spacing)
    context.closePath()
  }
}
var smallBlue = ['#0000ff',
  [[40,50], [70,80], [40,110], [100,50]] ]
var smallRed = ['#ff0000',
  [[43,50], [74,80], [43,109], [103,51]] ]

