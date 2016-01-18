var q = 1.602*Math.pow(10, -19)
var amu =1.6605* Math.pow(10, -27)
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
    var dmdx = -E*t * qtx / 2
    console.log(dmdt, dmdE, dmdx)
    var errT = Math.pow(dmdt * dt,2)
    var errE = Math.pow(dmdE * dE,2)
    var errX = Math.pow(dmdx * dx,2)
    return Math.pow(errT+errE+errX,.5)
  };
  API.mass = function(values){
    return (q/2)*(values.E/values.x)*Math.pow(values.t, 2)
  };
  return API
})()
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
  var errors = $('#error-size').find('input')
  console.log(errors)
  for(var value=0; value++ ; value < 3){
    console.log(errors[value])
  }
};

var more = function($element){
  $element.val($element.val()*1.1)
}
var less = function($element){
  $element.val($element.val()*0.9)
}
var reset = function($element){
  $element.val($element.attr('default'))
}
