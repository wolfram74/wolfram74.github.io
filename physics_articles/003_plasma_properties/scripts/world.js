var World = function(args){
  args = args || {}
  this.bodies = args.bodies || []
  this.features = args.features || []
  this.canvas = args.canvas || $('canvas').first()
  this.noEdge = args.noEdge || false
  this.rule = args.rule || function(body){
    body.applyForce( new Vector([.5,.25]))
  };
  this.time = 0
};

World.prototype.checkEdges = function(){
  if(!this.noEdge){
    for(var i=0; i<this.bodies.length; i++){
      this.bodies[i].checkEdges()
    };
  };
}

World.prototype.update = function(){
  for(var i=0; i<this.bodies.length; i++){
    this.rule(this.bodies[i])
    for(var j=0; j<this.features.length; j++){
      this.features[j].effect(this.bodies[j])
    };
  };
  for(var i=0; i<this.bodies.length; i++){
    this.bodies[i].update()
  };
  this.time +=1
};

World.prototype.display = function(options){
  options = typeof options !== 'undefined' ? options : {};
  var context = this.canvas[0].getContext('2d');
  if(!options.overlay){
    context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
  };
  for(var i=0; i<this.features.length; i++){
    this.features[i].display()
  };
  for(var i=0; i<this.bodies.length; i++){
    this.bodies[i].display()
  };
}

World.prototype.KEcalc = function(){
  var tote = 0
  for(var i=0; i<this.bodies.length; i++){
    var speed = this.bodies[i].velocity.mag()
    tote += this.bodies[i].mass * Math.pow(speed, 2)
  };
  return tote
};

var worldRun1 = function(){
  var worldView = canvasSetup('worldView')
  $('.displays').append(worldView)
  var bodies = []
  for(var i = 0; i < 15; i++){
    var bodyArgs = {
      mass: i*i*3,
      location: new Vector([1,1]),
      group: true,
      canvas: worldView
    };
    bodies.push(new Mover(bodyArgs))
  };
  var world = new World({
    bodies: bodies,
    canvas: worldView
  })
  iterator(10000, function(){
    world.checkEdges()
    world.update()
    world.display()
  }, 1)
}
