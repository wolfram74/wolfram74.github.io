$(document).on('ready', function(){
  console.log('ready')
  if(typeof MathJax !== 'undefined'){
    MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  }
  $('.container').each(Container.createFromElement)
});

var Container = function(options){
  options = this.defaults(options)
  this.height = options.height
  this.width = options.width
  this.$div = options.div
  this.center = [this.height/2, this.width/2]
  this.radius = options.radius
  this.mass = options.mass
  this.bodies = []
}

Container.prototype.defaults = function(options){
  if(options === undefined){
    options = {}
  };
  if(options.width === undefined){
    options.width = 400
  }
  if(options.height === undefined){
    options.height = 400
  }
  if(options.radius === undefined){
    options.radius = 75
  }
  if(options.mass === undefined){
    options.mass = 400
  }
  return options
};

Container.createFromElement = function(number, domElement){
  console.log('you mangy tosser')
  var $div = $(domElement)
  var sample = new Container({div: $div})
  sample.$div.find('canvas').attr(
    'width', (sample.width)
    )
  sample.$div.find('canvas').attr(
    'height', (sample.height)
    )
  $div.on('change', 'input[type=range]', sample.slideListener.bind(sample))
  $div.on('click', 'input[type=button]', sample.buttonListener.bind(sample))
  sample.draw()
  sample.reset()
}

Container.prototype.slideListener = function(event){
  var $input = $(event.target)
  var property = $input.attr('name')
  var value = $input.val()
  this[property] = value
  this.$div.find('.'+property+'_display').text(this[property])
}

Container.prototype.buttonListener = function(event){
  var $input = $(event.target)
  console.log($input.attr('name'))
  this[$input.attr('name')]()
}

Container.prototype.draw = function(){
  var context = this.$div.find('canvas')[0].getContext('2d')
  context.clearRect(0,0, this.width, this.height)
  this.drawCenter(context)
  this.drawBodies(context)
  this.updateBodies(context)
  setTimeout(this.draw.bind(this), 35)
}

Container.prototype.drawCenter = function(context){
  context.beginPath();
  context.arc(this.center[0], this.center[1], this.radius, 0, Math.PI*2)
  context.arc(this.center[0], this.center[1], 4, 0, Math.PI*2)
  context.stroke()
};

Container.prototype.drawBodies = function(context){
  for(var index=0; index < this.bodies.length; index++){
    this.bodies[index].drawSelf(context, this.center)
  }
}

Container.prototype.reset = function(){
  this.bodies = []
  for(var i = 0; i < 10; i++){
    this.bodies.push( new Body({radius:this.radius, mass:1, velocity: 2}))
  }
}

Container.prototype.updateBodies = function(){
  for(var index=0; index < this.bodies.length; index++){
    this.bodies[index].update(this.mass)
  }
}
// Container.prototype. = function(){}

var Body = function(options){
  this.position = Body.initPosition(options.radius)
  this.velocity = Body.initVelocity(options.velocity)
  this.mass = options.mass || 1
  this.radius = options.radius
}

Body.initPosition = function(radius){
  var thet = Math.random()*2*Math.PI
  var rx = radius*Math.cos(thet)
  var ry = radius*Math.sin(thet)
  return [rx, ry]
}

Body.initVelocity = function(velocity){
  var thet = Math.random()*2*Math.PI
  var vx = velocity*Math.cos(thet)
  var vy = velocity*Math.sin(thet)
  return [vx, vy]
}

Body.prototype.drawSelf= function(context, offset){
  var sx = this.position[0]+offset[0]
  var sy = this.position[1]+offset[1]
  context.beginPath();
  context.arc(sx, sy, 2, 0, Math.PI*2)
  context.stroke()
}

Body.prototype.update = function(mass){
  this.bounce()
  this.accelerate(mass)
  this.move()
}

Body.prototype.accelerate = function(mass){
  var distSquared = Math.pow(this.position[0],2)+Math.pow(this.position[1],2)
  var dist = Math.pow(distSquared, .5)
  var distCube = Math.pow(distSquared, 1.5)
  // console.log(this.position, dist, distSquared, distCube)
  var ox = this.velocity[0]
  var oy = this.velocity[1]
  // var nx = ox*Math.cos(.03) -oy*Math.sin(.03)
  // var ny = ox*Math.sin(.03) +oy*Math.cos(.03)

  var nx = ox-(mass/distCube)*this.position[0]
  var ny = oy-(mass/distCube)*this.position[1]
  this.velocity = [nx, ny]
}

Body.prototype.move = function(){
  this.position[0] += this.velocity[0]
  this.position[1] += this.velocity[1]
}

Body.prototype.bounce = function(){
  var px = this.position[0]
  var py = this.position[1]
  var vx = this.velocity[0]
  var vy = this.velocity[1]
  var nx = px + this.velocity[0]
  var ny = py + this.velocity[1]
  var distSquared = Math.pow(nx, 2) + Math.pow(ny,2)
  var nextDist = Math.pow(distSquared, .5)
  if(nextDist <= this.radius){
    var thet = Math.atan2(py, px)
    var nvx = -vx*Math.cos(2*thet) -vy*Math.sin(2*thet)
    var nvy = -vx*Math.sin(2*thet) +vy*Math.cos(2*thet)
    this.position = [(this.radius+1)*Math.cos(thet), (this.radius+1)*Math.sin(thet)]
    this.velocity = [nvx, nvy]
  }
}
