$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"],["<mj>","</mj>"]]}
    });
  $('#controls').on('input', 'input', sliderListener)
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
  staticDraw($('#demo-zone'), bigRed)
  var startVal = 1*$('#bin-spacing-controls')[0].value
  staticLines($('#demo-zone'), startVal)
  updateBars( startVal)
});

var sliderListener = function(event){
  var spacing = event.target.value
  var $canvas = $('#demo-zone')
  var context = $canvas[0].getContext('2d')
  context.clearRect(0,0,$canvas.width(), $canvas.height())
  staticDraw($canvas, bigRed)
  staticLines($canvas, 1*spacing)
  updateBars(spacing)
}

var updateBars = function(value){
  var $canvas = $('#charts-zone')
  var height = 300
  var width = 400
  var totalParticles = 300
  var xCount = Math.ceil(width/value)
  var yCount = Math.ceil(height/value)
  var binCount = xCount*yCount
  var binsPerPart = binCount/totalParticles
  var partsPerBin = totalParticles/binCount
  var checksPerPart = partsPerBin*9+1
  var context = $canvas[0].getContext('2d')
  context.clearRect(0,0,200,300)
  context.beginPath()
  context.fillStyle = '#00bbbb'
  context.fillRect(
    15, 300,
    75, -binsPerPart*10
    )
  context.closePath()
  context.beginPath()
  context.fillStyle = '#bbbb00'
  context.fillRect(
    115, 300,
    75, -checksPerPart*10
    )
  context.closePath()
};

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
  for(var i =0; i < y_count; i++){
    context.beginPath()
    context.moveTo(0, i*spacing)
    context.lineTo(width, i*spacing)
    context.stroke()
    context.closePath()
  }
  for(var i =0; i < x_count; i++){
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
var bigRed = ['#ff0000', []]
var particleSPacing = 21
var xOff = 5
var yOff = 5
var xdelta = [0, particleSPacing*0.5]
var ydelta = [particleSPacing, particleSPacing*0.66]
var row = 0
for(var i=0; i<300; i++){
  if( xOff > 400){
    row +=1
    var run = row%4
    xOff = 5 + xdelta[row%2]
    yOff += particleSPacing*0.866
  }
  xOff+=particleSPacing
  var part = []
  part.push(Math.random()*5-2+xOff)
  part.push(Math.random()*5-2+yOff)
  bigRed[1].push(part)
};
