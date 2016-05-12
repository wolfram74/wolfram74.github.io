$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('.resonator').each(Resonator.createFromElement)

});

var Resonator = function(options){
  options = this.defaults(options)
  this.height = options.height
  this.width = options.width
  this.$div = options.div
  this.w0 = 1
  this.beta = .05
  this.w1 = Math.pow(this.w0*this.w0-this.beta*this.beta ,0.5)
  this.t = 0
  this.b1 =0
  this.b2 =0
  this.amp = 1
  this.delt = 0
  this.w = .5
  this.f0 = 10
  this.xs = [0]
  this.vi = 0
}

Resonator.prototype.defaults = function(options){
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

Resonator.createFromElement = function(number, domElement){
  console.log('you mangy tosser')
  var $div = $(domElement)
  var sample = new Resonator({div: $div})
  sample.$div.find('canvas').attr(
    'width', (sample.width)
    )
  sample.$div.find('canvas').attr(
    'height', (sample.height)
    )
  $div.on('change', 'input[type=range]', sample.slideListener.bind(sample))
  sample.updateState()
  sample.draw()
}

Resonator.prototype.slideListener = function(event){
  var $input = $(event.target)
  var property = $input.attr('name')
  var value = $input.val()
  this[property] = value
  this.$div.find('.'+property+'_display').text(this[property])
  this.updateState()
}

Resonator.prototype.draw = function(){
  var context = this.$div.find('canvas')[0].getContext('2d')
  context.clearRect(0,0, this.width, this.height)
  this.timeStep()
  this.drawPath(context)
  this.drawFrame(context)
  setTimeout(this.draw.bind(this), 35)
}

Resonator.prototype.timeStep = function(){
  this.t += .035
  this.xs.push(this.xt())
  this.vi = this.vt()
  if( this.xs.length > 400){this.xs.shift()}
}

Resonator.prototype.xt = function(){
  //A*cos(w*t-d) + e^(-b*t)*(b1*cos(w1*t)+b2*sin(w1*t))
  var trans1 = Math.exp(-1*this.beta*this.t)
  var trans2 = (
    this.b1*Math.cos(this.w1*this.t)
    +this.b2*Math.sin(this.w1*this.t)
    )
  var attractor = this.amp*Math.cos(this.w*this.t -this.delt)
  return attractor +trans1*trans2
}

Resonator.prototype.vt = function(){
  //-A*w*sin(d-t*w)
  //-b*e^(-b*t)*( b1*cos(t*w1) + b2*sin(t*w1) )
  //+e^(-b*t)*( b2*w1*cos(t*w1)-b1*w1*sin(t*w1) )
  var tw1 = this.t*this.w1
  var attractor = -1*this.amp*this.w*Math.sin(this.delt - this.t*this.w)
  var decay = Math.exp(-1*this.beta*this.t)
  var left = this.b2*this.w1*Math.cos(tw1)-this.b1*this.w1*Math.sin(tw1)
  var right = this.b1*Math.cos(tw1)+this.b2*Math.sin(tw1)
  return decay*(left-this.beta*right)-attractor
}

Resonator.prototype.updateState = function(){
  this.t = 0
  this.delt = Math.atan(
    2*this.beta*this.w/
    (this.w0*this.w0-this.w*this.w)
    )
  var denom = (Math.pow((this.w0*this.w0-this.w*this.w),2)
    +4*Math.pow(this.beta*this.w,2))
  this.amp = Math.pow(this.f0*this.f0/denom,0.5)
  this.b1 = this.xs[this.xs.length -1] - this.amp*Math.cos(this.delt)
  this.w1 = Math.pow(this.w0*this.w0-this.beta*this.beta,0.5)
  this.b2 = (this.vi + this.beta*this.b1
    - this.w*this.amp*Math.sin(this.delt)
    )
  console.log(this.amp)
}

Resonator.prototype.drawPath = function(context){
  var halfHeight = this.height/2
  var dx = 1/400
  context.strokeStyle = '#000'
  for(var index = this.xs.length-1; index >-0; index--){
    var rx = dx*index
    var ry = this.xs[index]/25//scale by 25
    var sx = this.width - rx * this.width
    var sy = halfHeight - ry*halfHeight
    context.beginPath();
    context.arc(sx, sy, 1, 0, Math.PI*2)
    context.stroke();
  }
}

Resonator.prototype.drawFrame = function(context){
  context.strokeStyle = '#f33'
  var halfHeight = this.height/2
  var rail = this.amp/25
  context.beginPath();
  context.moveTo(0, halfHeight - rail*halfHeight)
  context.lineTo(this.width, halfHeight - rail*halfHeight)
  context.stroke()
  context.beginPath();
  context.moveTo(0, halfHeight + rail*halfHeight)
  context.lineTo(this.width, halfHeight + rail*halfHeight)
  context.stroke()
}
// Resonator.prototype. = function(){}
