$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('.demostring').each(DemoString.createFromElement)
});

var DemoString = function(options){
  options = this.defaults(options)
  this.height = options.height
  this.width = options.width
  this.$div = options.div
  this.alpha = .4 // scale x by width since it will range from 0 to 1, same for height
  this.sample = 1
  this.a = 1.1
  this.x0 =.5
  this.b = .45
}

DemoString.prototype.defaults = function(options){
  if(options === undefined){
    options = {}
  };
  if(options.width === undefined){
    options.width = 400
  }
  if(options.height === undefined){
    options.height = 200
  }
  return options
};

DemoString.createFromElement = function(number, domElement){
  console.log('you mangy tosser')
  var $div = $(domElement)
  var sample = new DemoString({div: $div})
  sample.$div.find('canvas').attr(
    'width', (sample.width)
    )
  sample.$div.find('canvas').attr(
    'height', (sample.height)
    )
  $div.on('change', 'input[type=range]', sample.slideListener.bind(sample))
  $div.on('click', 'input[type=button]', sample.buttonListener.bind(sample))
  // debugger
  sample.draw()
}

DemoString.prototype.slideListener = function(event){
  var $input = $(event.target)
  var property = $input.attr('name')
  var value = $input.val()
  this[property] = value
  this.$div.find('.'+property+'_display').text(this[property])

}

DemoString.prototype.buttonListener = function(event){

}

DemoString.prototype.draw = function(){
  var rawContext = this.$div.find('.raw')[0].getContext('2d')
  this.drawRaw(rawContext)
  if(this.$div.find('.fourier').length){
    var fourierContext = this.$div.find('.fourier')[0].getContext('2d')
    var reconstructionContext = this.$div.find('.reconstruction')[0].getContext('2d')
    this.drawFourier(fourierContext)
    this.drawReconstruction(reconstructionContext)
  }
  setTimeout(this.draw.bind(this), 35)
}

DemoString.prototype.drawRaw = function(context){
  context.clearRect(0,0, this.width, this.height)
  this.drawArc(context)
  this.drawLines(context)
}

DemoString.prototype.drawArc = function(context){
  var points = 200;
  var dx = 1/points
  context.fillStyle = '#aaa'
  context.strokeStyle = '#aaa'
  for(var xi=0; xi< points; xi++){
    var rx = xi*dx
    var sx = rx * this.width
    // var theta = Math.acos((rx-this.x0)/this.a)
    // var ry = (this.b*Math.sin(theta))
    var ry = this.y0(rx)
    var sy = this.height - this.height*ry
    context.beginPath();
    context.arc(sx, sy, 1, 0, Math.PI*2)
    context.stroke();
  }
}

DemoString.prototype.drawLines = function(context){
  var y0 = this.y0()
  context.strokeStyle = '#000'
  context.beginPath();
  context.moveTo(0, this.height)
  context.lineTo(this.alpha*this.width, this.height-y0*this.height)
  context.lineTo(this.width, this.height)
  context.stroke();
}

DemoString.prototype.drawFourier = function(context){
  context.clearRect(0,0, this.width, this.height)
  var bars = 50;
  var bWidth = 1/bars;
  var norm = this.aValue(0)
  for(var n=0; n <= bars; n++){
    context.fillStyle = n <= this.sample ? '#aad' : '#daa'
    // var an = this.aValue(n)
    var an = Math.pow(this.aValue(n), 2)
    var an = Math.pow(an, .5)/norm
    context.beginPath()
    context.fillRect(
      n*bWidth*this.width ,this.height-an*this.height,
      bWidth*this.width, an*this.height)
    context.stroke()
  }
}

DemoString.prototype.drawReconstruction = function(context){
  context.clearRect(0,0, this.width, this.height)
  var points = 200
  var dx = 1/points
  context.strokeStyle = '#aad'
  for(var xi=0; xi<points; xi++){
    var rx = xi*dx;
    var sx = rx*this.width
    var ry = 0
    for(var n = 0; n <= this.sample; n ++){
      ry += this.bValue(n)*Math.sin(n*Math.PI*rx)*2
      // ry += this.aValue(n)*Math.cos(n*Math.PI*rx)
    }
    var sy = this.height - this.height*ry
    context.beginPath();
    context.arc(sx, sy, 1, 0, Math.PI*2)
    context.stroke();
  }
  this.drawLines(context)
}

DemoString.prototype.bValue = function(n){
  var y0 = this.y0()
  if(n===0){return 0}
  var npi = n*Math.PI
  var al = 1*this.alpha
  var npia = npi * al
  var numer = y0*(al*Math.sin(npi) - Math.sin(npia))
  var denom = (Math.pow(npi,2)*(al*al - al))
  return numer/denom
}
DemoString.prototype.aValue = function(n){
  var y0 = this.y0()
  if(n===0){return y0/4}
  var npi = n*Math.PI
  var al = 1*this.alpha
  var npia = npi * al
  var numer = y0*(al*(Math.cos(npi) - 1) - Math.cos(npia) + 1)
  var denom = (Math.pow(npi,2)*(al*al - al))
  return numer/denom
}

DemoString.prototype.y0 = function(x){
  var dx = x || this.alpha
  var theta = Math.acos((dx-this.x0)/this.a)
  return (this.b*Math.sin(theta))
  // if(x){ return 4*x*(1-x)}
  // return 4*this.alpha*(1-this.alpha)
}

