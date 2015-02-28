// init screen
var size = 800;
canvas.setAttribute("width", size);
canvas.setAttribute("height", size);
canvas.style.width= size+"px";
canvas.style.height= size+"px";
// finish init



function timeOfFlight(xi, yi, max, options){
  n= 0;
  var x = xi;
  var y = yi;
  while(x*x + y*y < 4){
    if (options){
      console.log(x, y, n);
    }
    xn = x*x - y*y + xi;
    yn = 2*x*y+yi ;
    n++;
    x = xn;
    y = yn;
    if (n >= max){return n};
  };

  if (options){
    console.log(x, y, n);
  };
  return n;
}

function heatMap(n, max){
  norm = n/max
  if (norm === 1){ return [0,0,0,255]}
  var r = (1-norm)*255
  var g = (norm)*(1-norm)*4*255
  var b = norm*255
  return [r,g,b, 255]
} 

function renderSet(x0, y0, magnify, gradient_resolution){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var image = context.createImageData(size,size);
  var bounds = Math.pow(2, 1-magnify);
  var increment = (bounds*2)/size;
  var xmin = x0-bounds;
  var ymin = y0+bounds;
  for(x=0;x<size; x++){
    for(y=0;y<size; y++){
      i = x+y*size;
      var xin = xmin + x * increment;
      var yin = ymin - y * increment;
      var speed = timeOfFlight(xin, yin, gradient_resolution);
      var colors = heatMap(speed, gradient_resolution);
      image.data[4*i+0]=colors[0];
      image.data[4*i+1]=colors[1];
      image.data[4*i+2]=colors[2];
      image.data[4*i+3]=255;
    }
  }
  context.putImageData(image,0,0);
}

function keyParser(event){
  var input = String.fromCharCode(event.keyCode)
  var bounds = Math.pow(2, 1-magnify);
  var increment = (bounds*2)/size;

  if(input == "p"){ //P -> render
    renderSet(center[0], center[1], magnify, gradientResolution)
    $("#dx").text(0)
    $("#dy").text(0)
  }
  if(input == "w"){ // w -> move up
    center[1] = center[1] + 16*increment
    $("#dy").text(parseInt($("#dy").text(),10)+1)
  }
  if(input == "a"){ // a -> move left
    center[0] = center[0] - 16*increment    
    $("#dx").text(parseInt($("#dx").text(),10)-1)
  }
  if(input == "s"){ // s-> move down
    center[1] = center[1] - 16*increment
    $("#dy").text(parseInt($("#dy").text(),10)-1)
  }
  if(input == "d"){ // d-> move right
    center[0] = center[0] + 16*increment    
    $("#dx").text(parseInt($("#dx").text(),10)+1)
  }
  if(input == "r"){ // r-> coarser image
    gradientResolution = gradientResolution/2
    $("#grad").text(gradientResolution)
    renderSet(center[0], center[1], magnify, gradientResolution)
  }
  if(input == "f"){ // f-> smoother image
    gradientResolution = gradientResolution*2
    $("#grad").text(gradientResolution)
    renderSet(center[0], center[1], magnify, gradientResolution)
  }
  if(input == "i"){ // I-> move/zoom in
    magnify++
    $("#zoom").text(magnify)
    renderSet(center[0], center[1], magnify, gradientResolution)
  }
  if(input == "o"){ // O-> move/zoom out
    magnify--
    $("#zoom").text(magnify)
    renderSet(center[0], center[1], magnify, gradientResolution)    
  }
  // renderSet(center[0], center[1], magnify, gradientResolution);
  // $("#dx").text(0);
  // $("#dy").text(0);

}

var center = [0,0];
var magnify = 0;
var gradientResolution = 128;
renderSet(center[0], center[1], magnify, gradientResolution)

$(document).keypress(keyParser)
setInterval( function(){
    renderSet(center[0], center[1], magnify, gradientResolution);
    $("#dx").text(0);
    $("#dy").text(0);
  }, 500) 