$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('#ei_start').on('click', eiRun)
  $('#en_start').on('click', enRun)
  $('#ion_impact_parameter').on('input', 'input[type=range]', sliderListener)
  $('#neutral_impact_parameter').on('input', 'input[type=range]', sliderListener)
  staticDrawCollision(states.ei)
  staticDrawCollision(states.en)
  updateShoState()
  iterator(30*2000,
    function(){
      drawOscilator()
      shoState.t += 1
    },
    30)
  $('#plasma_density').on('input', updateShoState)
});

var eiRun = function(){
  console.log('fart noises')
  var view = $(states.ei.canvasID)
  var testCharge = new Mover({
    mass: 2,
    location: new Vector([0, states.ei.distance]),
    velocity: new Vector([states.ei.velocity / 10, 0]),
    group: true,
    canvas: view
  })
  var world = new World({
    bodies: [testCharge],
    canvas: view,
    rule: function(body){
      var displace = Vector.sub(new Vector([100,100]), body.location)
      var field = (75/displace.dot(displace))
      body.applyForce(displace.normalize().mult(field))
    }
  })
  iterator(300,
    function(){
      world.update()
      world.display({overlay: true})
    },
    30)
}

var enRun = function(){
  var view = $(states.en.canvasID)
  var testCharge = new Mover({
    mass: 2,
    location: new Vector([0, states.en.distance]),
    velocity: new Vector([states.en.velocity / 10, 0]),
    group: true,
    canvas: view
  })
  testCharge.bounced = false
  var world = new World({
    bodies: [testCharge],
    canvas: view,
    rule: function(body){
      var displace = Vector.sub(new Vector([100,100]), body.location)
      if(!body.bounced && displace.mag() < 10 ){
        console.log(Math.atan2(displace.values[1], displace.values[0]))
        var theta = 2*Math.atan2(displace.values[1], displace.values[0])-MKS.pi
        var v0 = body.velocity.mag()
        body.velocity.values[0] = v0* Math.cos(theta)
        body.velocity.values[1] = v0* Math.sin(theta)
        body.bounced = true
      }
    }
  })
  iterator(300,
    function(){
      world.update()
      world.display({overlay: true})
    },
    30)
}

var sliderListener = function(){
  console.log('slide noises')
  var target = this.id.split('_')
  states[target[0]][target[1]] = 1*this.value
  staticDrawCollision(states[target[0]])
}

var staticDrawCollision = function(state){
  var $canvas = $(state.canvasID)
  var height = 200-state.distance
  var radius = 75/( Math.pow(state.velocity/10, 2))
  var context = $canvas[0].getContext('2d')
  context.clearRect(0,0,200,200)
  context.fillStyle = '#ff66d8'
  context.beginPath()
  context.arc(
    100,100,
    state.canvasID.indexOf('ion') < 4 ? radius : 10 ,
    0, 2*MKS.pi
    )
  context.fill()
  context.closePath()
  context.fillStyle = '#6666ff'
  context.beginPath()
  context.moveTo(0, height)
  context.lineTo(200, height)
  context.stroke()
  context.closePath()
}

var states = {
  ei: {
    distance:50,
    velocity:20,
    canvasID: '#ion_collision_display'
  },
  en:  {
    distance:50,
    velocity:20,
    canvasID: '#neutral_collision_display'
  }
}

var MKS = {
  Me: 9.109 * Math.pow(10,-31), // electron mass
  Mp: 1.673 * Math.pow(10,-27), // proton mass
  q: 1.602  * Math.pow(10,-19), // fundamental charge
  e0: 8.854 * Math.pow(10,-12), // permitivity free space
  pi: Math.PI,                // circle constant, you troglodyte.
}

var plasma_freq = function(density){
  return Math.sqrt(
    (density * Math.pow(MKS.q, 2))/
    (MKS.e0* MKS.Me)
    )
}

var elecIonCollision = function(density, temperature){
  var numer = Math.pow(MKS.q, 4)
  var denom = Math.pow(MKS.e0, 2)*Math.pow(MKS.Me, 0.5)*16*MKS.pi
  var ratio = ( density / Math.pow(temperature, 1.5) )
  return (numer/denom) * ratio
}

var collisionality = function(density, temperature){
  var numer = Math.pow(MKS.q, 3)
  var denom = Math.pow(MKS.e0, 1.5)*16*MKS.pi
  var ratio = (numer/denom)*( Math.pow(density, .5) /Math.pow(temperature, 1.5) )
  console.log(ratio)
}

var testing = function(){
  console.log('lightening')
  collisionality(Math.pow(10,23), 10*MKS.q)
  console.log('candle')
  collisionality(Math.pow(10,15), .1*MKS.q)
  console.log('aurora')
  collisionality(Math.pow(10,9), .1*MKS.q)
  console.log('core')
  collisionality(Math.pow(10,33), 100*MKS.q)
  console.log('stabbing')
  collisionality(Math.pow(10,25), 5*MKS.q)
  console.log('cold stabbing')
  collisionality(Math.pow(10,9), .001*MKS.q)
}

var shoState = {
  canvasID: '#plasma_oscilation',
  t: 0,
  phase: 0,
  density: 20,
  w0: 4
}

var updateShoState = function(){
  var newRho = 1*$('#plasma_density').val()
  var newW = .1*Math.sqrt(newRho)
  var newPhase = shoState.t*(shoState.w0-newW)+shoState.phase
  shoState.w0 = newW
  shoState.density = newRho
  shoState.phase = newPhase
}

var drawOscilator =function(){
  var $canvas = $(shoState.canvasID)
  var width = 120
  var height = 150
  var context = $canvas[0].getContext('2d')
  var electrons = 'rgba(0,0,255,'+shoState.density/100+')'
  var argon = 'rgba(204,102,153,'+shoState.density/100+')'
  var theta = shoState.w0*shoState.t + shoState.phase
  var deltaX = 20*Math.cos(theta)
  context.clearRect(0,0,200,200)
  context.fillStyle = electrons
  context.beginPath()
  context.beginPath()
  context.fillRect(
    40+deltaX, 25,
    width, height
    )
  context.closePath()
  context.fillStyle = argon
  context.beginPath()
  context.fillRect(
    40, 25,
    width, height
    )
  context.closePath()
}

