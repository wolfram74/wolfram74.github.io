var setUp = function(){
  window.onkeyup = circle.keyHandler.bind(circle)
}

var render = function(){
  var canvas = document.getElementsByTagName('canvas')[0]
  var context = canvas.getContext('2d')
  var width = canvas.width
  var height = canvas.height
  context.clearRect(0,0, height,width)
  context.beginPath();
  context.arc(this.x, this.y, 5, 0, Math.PI*2)
  context.stroke();
}

var keyHandler = function(keyUp){
  var code = keyUp.keyCode
  var letter = String.fromCharCode(code)
  if(letter === "A"){
    this.x -= 10
  }else if(letter === "D"){
    this.x += 10
  }else if(letter === "W"){
    this.y -= 10
  }else if(letter === "S"){
    this.y += 10
  }
  this.render()
}

var circle = {
  x: 300,
  y: 300,
  render: render,
  keyHandler: keyHandler
}

window.onload=setUp
