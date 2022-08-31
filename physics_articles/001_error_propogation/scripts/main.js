var q = 1.602 *Math.pow(10, -19)
var amu =1.6605 * Math.pow(10, -27)
var t182 = 8.68678 * Math.pow(10, -4)
var t183 = 8.71062 * Math.pow(10, -4)
var calcs = (function(){
  var API = {}
  API.dMass = function(values){
    var t = values.t
    var dt = values.dt
    var E = values.E
    var dE = values.dE
    var x = values.x
    var dx = values.dx
    var qtx = q*t/x
    var dmdt = E * qtx
    var dmdE = t * qtx / 2
    var dmdx = E*t * qtx / 2
    var errT = Math.pow(dmdt * dt,2)
    var errE = Math.pow(dmdE * dE,2)
    var errX = Math.pow(dmdx * dx,2)
    updateDisplay(errE, errX, errT)
    return Math.pow(errT+errE+errX,.5)
  };
  API.mass = function(values){
    return (q/2)*(values.E/values.x)*Math.pow(values.t, 2)
  };
  return API
})()
var t
var test = {
  E:10, dE:.1,
  t:.00087, dt:.00001,
  x:2, dx:.001
}

$(document).on('ready', function(){
  console.log('prepped')
  $('#error-size').on('click', 'button', formListener)
});

var formListener = function(event){
  var $button = $(this)
  window[$button.attr('class')]($button.siblings('input').eq(0))
  var errors = $('#error-size').serializeArray()
  var data= {E: 10, x:2}
  for(var value=0;  value < 3 ; value++ ){
    data[errors[value].name] = 1*errors[value].value
  };
  data.t = t182
  var m182 = calcs.mass(data)/amu
  var dm182 = calcs.dMass(data)/amu
  data.t = t183;
  var m183 = calcs.mass(data)/amu;
  var dm183 = calcs.dMass(data)/amu;
  console.log(m182, dm182);
  console.log(m183, dm183);
  var gau182 = curve(m182, dm182, 400, 172, 192);
  var gau183 = curve(m183, dm183, 400, 172, 192);
  var total = sum(gau182, gau183);
  plot(total, 400, 200, 172, 192)
};

var more = function($element){
  $element.val($element.val()*2)
}
var less = function($element){
  $element.val($element.val()*0.5)
}
var reset = function($element){
  $element.val($element.attr('default'))
}

var curve = function(mean, sigma, steps, lower, upper){
  var norm = 1/(sigma * Math.pow(2, .5))
  var step = (upper-lower)/steps
  var values = []
  for(var i=0; i < steps; i++){
    var valIn = Math.pow(
        Math.E,
        -.5*Math.pow(
          (lower+i*step-mean)/sigma,
          2
          )
      )
    values.push(valIn)
  }
  return values
}

var sum = function(list1, list2){
  var combo = []
  for(var i=0; i< list1.length; i++){
    combo.push(list1[i]+list2[i])
  };
  return combo
};

var max = function(list){
  var highest = 0;
  for(var i=0; i< list.length; i++){
    if(list[i]>highest){highest = list[i]}
  };
  return highest
};

var plot = function(y_values, width, height, lower, upper){
  var context = $('canvas')[0].getContext('2d')
  context.clearRect(0,0, width, height);
  context.fillStyle = 'rgba(0,0,0,1)'
  var peak = max(y_values)
  for(var i = 0; i< y_values.length; i++){
    context.beginPath()
    context.arc(i, height-(y_values[i]/peak * 0.9 * height), 1, 0, 2*Math.PI)
    context.fill()
    context.closePath()
  };
}

var updateDisplay = function(field, distance, time){
  field = Math.pow(field, .5)
  distance = Math.pow(distance, .5)
  time = Math.pow(time, .5)
  $('#dE').siblings('span').html((field/amu).toFixed(2) + 'amu ')
  $('#dx').siblings('span').html((distance/amu).toFixed(2) + 'amu ')
  $('#dt').siblings('span').html((time/amu).toFixed(2) + 'amu ')
};
MathJax.Hub.Config({
    tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
  });
