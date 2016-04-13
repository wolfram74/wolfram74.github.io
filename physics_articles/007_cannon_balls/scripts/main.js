$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('.firing-range').each(FiringRange.createFromElement)
});

var mod = function(n, m){
  return ((n%m)+m)%m
}

var FiringRange = function(options){
  options = this.defaults(options)
  this.height = options.height
  this.width = options.width
  this.$div = options.div
  this.theta = 0
  this.velocity = 0
  this.sigmaV = 0
  this.sigmaTheta = 0
  this.targetX = 0
  this.firingRate = 0
  this.paths = []
  // will contain arrays of points that will be appended 3 at a time for however many paths are being rendered.
  //scratch that, a Path object will contain behaviors for tracking and animating a path
}

FiringRange.prototype.defaults = function(options){
  if(options === undefined){
    options = {}
  };
  if(options.width === undefined){
    options.width = 200
  }
  if(options.height === undefined){
    options.height = 200
  }
  return options
};

FiringRange.prototype.fire = function(){
  this.paths = [
    new Path(
      this.velocity, this.theta,
      this.sigmaV, this.sigmaTheta
      )
    ]
}

FiringRange.prototype.bombard = function(){
  console.log('precision multi-pchew!!')
}

FiringRange.prototype.draw = function(){
  var $canvas = this.$div.find('canvas')
  var context = $canvas[0].getContext('2d')
  context.clearRect(0,0, this.width, this.height)
  this.drawFiringRange(context)
  for(var pathInd = 0; pathInd < this.paths.length; pathInd++){
    this.paths[pathInd].draw(context)
  }
  this.update()
  setTimeout(this.draw.bind(this), 30)
}

FiringRange.prototype.update = function(){
  for(var pathInd = 0; pathInd < this.paths.length; pathInd++){
    this.paths[pathInd].step()
    this.paths[pathInd].step()
    this.paths[pathInd].step()
  }

}

FiringRange.prototype.drawFiringRange = function(context){
  context.fillStyle = '#000000'
  context.lineWidth = '1'
  var vx = Math.cos(this.theta)*this.velocity
  var vy = Math.sin(this.theta)*this.velocity
  context.beginPath();
  context.moveTo(0, this.height);
  context.lineTo(vx, this.height-vy)
  context.stroke();
};

FiringRange.prototype.slideListener = function(event){
  var $input = $(event.target)
  var property = $input.attr('name')
  var value = $input.val()
  this[property] = property.indexOf('bField') > -1 ? (value-50)/50 : value
  this.$div.find('.'+property+'_display').text(this[property])
}
FiringRange.prototype.buttonListener = function(event){
  var $input = $(event.target)
  console.log($input.attr('name'))
  this[$input.attr('name')]()
}

FiringRange.createFromElement = function(number, domElement){
  console.log('you mangy tosser')
  var $div = $(domElement)
  var sample = new FiringRange({div: $div})
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

var Path = function(v0, theta, sigV, sigT){
  this.t = 0
  this.v0 = v0
  this.theta = theta
  this.sigV = sigV
  this.sigT = sigT
  this.points = []
};

Path.prototype.step = function(){
  // xt = cos(tht)*v0*t
  // yt = sin(tht)*v0*t - g/2*t^2, g = 10
  if(!this.finished()){
    var xt = Math.cos(this.theta)*this.v0*this.t
    var yt = Math.sin(this.theta)*this.v0*this.t - 5*this.t*this.t
    this.points.push([xt, yt, this.t])
    this.t += .01 // t in seconds, increment 10 ms at a time, 3 steps a frame
  }
};

Path.prototype.finished = function(){
  return this.points.length > 1 && this.points[this.points.length-1][1] < 0
}

Path.prototype.dxdv = function(t){
  // xt = cos(tht)*v0*t
  // dxdv = cos(tht)*t
  return Math.cos(this.theta)*t

}
Path.prototype.dxdth = function(t){
  //dxdth = -sin(tht)*v0*t
  return -Math.sin(this.theta)*this.v0*t
}
Path.prototype.dydv = function(t){
  // yt = sin(tht)*v0*t - g/2*t^2, g = 10
  // dydv = sin(tht)*t
  return Math.sin(this.theta)*t
}
Path.prototype.dydth = function(t){
  // dydth = cos(tht)*v0*t
  return Math.cos(this.theta)*this.v0*t
}

Path.prototype.delX = function(t){
  var sigTheta = Math.pow(
    this.dxdth(t)*this.theta*this.sigT,
    2)
  var sigVel = Math.pow(
    this.dxdv(t)*this.v0*this.sigV,
    2)
  return Math.pow(sigVel+sigTheta, 0.5)
}

Path.prototype.delY = function(t){
  var sigTheta = Math.pow(
    this.dydth(t)*this.theta*this.sigT,
    2)
  var sigVel = Math.pow(
    this.dydv(t)*this.v0*this.sigV,
    2)
  return Math.pow(sigVel+sigTheta, 0.5)
}

Path.prototype.draw = function(context){
  var height = context.canvas.clientHeight
  for(var pointInd = 0; pointInd < this.points.length; pointInd++){
    var point = this.points[pointInd]
    var delX = this.delX(point[2])*20
    var delY = this.delY(point[2])*20
    var x = point[0]*20
    var y = height-point[1]*20
    drawEllipse(x, y, delX, delY, context)
  }
  for(var pointInd = 0; pointInd < this.points.length; pointInd++){
    var point = this.points[pointInd]
    // var delX = this.delX(point[2])*20
    // var delY = this.delY(point[2])*20
    var x = point[0]*20
    var y = height-point[1]*20
    context.fillStyle = "#000000";
    context.fillRect(x, y ,2,2)
  }
}

function drawEllipse(centerX, centerY, width, height, context) {

  context.beginPath();

  context.moveTo(centerX, centerY - height/2); // A1

  context.bezierCurveTo(
    centerX + width/2, centerY - height/2, // C1
    centerX + width/2, centerY + height/2, // C2
    centerX, centerY + height/2); // A2

  context.bezierCurveTo(
    centerX - width/2, centerY + height/2, // C3
    centerX - width/2, centerY - height/2, // C4
    centerX, centerY - height/2); // A1

  context.fillStyle = "#ffaaaa";
  context.fill();
  context.closePath();
}
