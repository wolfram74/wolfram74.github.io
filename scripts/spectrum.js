var fftjs = new FFTJS()
var samples = Math.pow(2, 10)
fftjs.init(samples)
$("#canvas").attr("height", samples)
$("#canvas").attr("width", 800)
$("#canvas").css("height", samples)
// setInterval(function(){
//   var fft = fftjs.fft()
//   console.log(fft)  
// },1000)
// $(document).append(fftjs.fft())

function colorMap(number){
  return [number, 255-number,0]
}

function drawColumn(colNum){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d") ;
  var image = context.createImageData(1,samples)
  var fft = fftjs.fft()
  for(y=0; y< samples; y++){
    var colors = colorMap(fft[y]);
    image.data[4*y+0]=colors[0];
    image.data[4*y+1]=colors[1];
    image.data[4*y+2]=colors[2];
    image.data[4*y+3]=255;
  };
  context.putImageData(image,colNum,0);
}

var stepper = (function(){
  var x= 0
  return function(){
    drawColumn(x%800);
    x++;
  };
})()

setInterval(stepper,20)




