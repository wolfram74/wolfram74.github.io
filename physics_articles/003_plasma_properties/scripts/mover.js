var Mover = function(args){
  args = args || {}
  this.group = args.group || false
  this.canvas = args.canvas || $('canvas').first()
  this.maxY = this.canvas.height()
  this.maxX = this.canvas.width()
  var yOff = this.canvas.height()/2
  var xOff = this.canvas.width()/2
  this.mass = args.mass || 1
  this.location = args.location || new Vector([xOff,yOff])
  this.velocity = args.velocity || new Vector([0,0])
  this.acceleration = args.acceleration || new Vector([0,0])
};

Mover.prototype.update = function(){
  this.velocity.add(this.acceleration)
  this.location.add(this.velocity)
  this.acceleration = new Vector([0,0])
};

Mover.prototype.applyForce = function(vectorForce){
  this.acceleration.add(Vector.div(vectorForce, this.mass))
};

Mover.prototype.checkEdges=function(){
  //works if square canvas, so what if it's brittle, look at that iterator function!
  // this.location.modulus(this.canvas.height())
  // console.log(this.location.values[1], this.maxY)
  if(this.location.values[0] > this.maxX || this.location.values[0] < 0){
    this.velocity.values[0] *= -1
  };
  if(this.location.values[1] > this.maxY || this.location.values[1] < 0){
    this.velocity.values[1] *= -1
  };
};

Mover.prototype.display = function(){
  var context = this.canvas[0].getContext('2d');
  var x = this.location.values[0]
  var y = this.location.values[1]
  radius = Math.pow(this.mass, .5)
  if(!this.group){
    console.log('clearing')
    context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
  };
  context.beginPath()
  context.fillStyle = "rgba(0,0,0,1)"
  context.arc(x, this.canvas.height()-y, radius, 0, 2*Math.PI)
  context.fill()
  context.closePath()
}

var moverRun = function(){
  var moveView = canvasSetup('moverView')
  $('.displays').append(moveView)
  var acc = new Vector([0.01,0.02])
  var mov = new Mover({canvas: moveView, mass:100,acceleration: acc })
  // debugger
  iterator(10000, function(){
    mov.checkEdges()
    mov.update()
    mov.acceleration = acc
    mov.display()
  }, 1)
}
