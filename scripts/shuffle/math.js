function shufflePath(card, deckSize){
  var path = [card, (card*2)%(deckSize-1)]
  while(path[0]%(deckSize-1) !== path[path.length-1]){
    var last =  path[path.length-1] 
    path.push((last*2)%(deckSize-1))
  };
  path.pop()
  return path
};

function pointList(card, deckSize){
  var path = shufflePath(card, deckSize)
  var points = []
  for(var index in path){
    points.push($V([index*1, path[index] ]) )
  };
  return points
}

function parseSerialize(serial){
  var object ={}
  serial = serial.split("&")
  for(var index in serial){
    var kv = serial[index].split("=")
    object[kv[0]]= kv[1]
  };
  return object
}

function arrayMult(array, n){
  var multedArray = []
  for(i=0; i< n; i++){
    multedArray = multedArray.concat(array)
  };
  return multedArray
};

function vectorToRGB(array){
  var color = "rgba("
  array.pop()
  for(var index in array){
    var value = Math.floor(array[index])
    color = color + value +",";
  };
  color = color +"1)"
  return color
};

function pathToPolyline(vectArray, dX, dY){
  var polyString =""
  for(var index in vectArray){
    var xVal = (index*1+0.5)*dX
    var yVal = (vectArray[index].e(2)+0.5)*dY
    var pointString = xVal+","+yVal+" "
    polyString = polyString + pointString
  };
  return polyString
};

var colors = (function(){
  var API = {}
  API.c1 = function(n, max){
  norm = n/max;
    if (norm === 1||norm === 0){ return [0,0,0,255]};
    var r = (1-norm)*255;
    var g = (norm)*(1-norm)*4*255;
    var b = norm*255;
    return [r,g,b, 255];
  }; 
  return API
})()

$(document).ready(function(){
  $("form").on("submit", render);
});

function render(){
  event.preventDefault()
  $("#drawing").empty()
  var args = parseSerialize($(event.target).serialize())
  var deck = args["decksize"]
  if(deck%2 ===1){deck++}
  var colorScheme = "c"+ args["color"]
  var paths = []
  console.log(args)
  for(var i =1; i < deck-1; i++){
    var newPath = pointList(i, deck)
    if(i === 1){ 
      newPath= arrayMult(newPath, 2)
      paths.push(newPath); 
      continue;}
    if(newPath.length < paths[0].length){
      newPath = arrayMult(newPath, (paths[0].length)/(newPath.length))
    };
    paths.push(newPath)
  };
  var top = []
  var bottom = []
  for(var i =0; i < paths[0].length; i++){
    top.push($V([i, 0]))
    bottom.push($V([i,deck-1]))
  };
  paths.push(top);
  paths.push(bottom);
  plot(paths, colorScheme)
};

function plot(paths, colorScheme){
  var leng = 600;
  var deltX = leng/(paths[0].length);
  var deltY = leng/(paths.length);
  var drawing = SVG('drawing').size(leng,leng);
  console.log(paths)
  for(pathInd in paths){
    var path = paths[pathInd]
    if(true){
      var rgb = colors[colorScheme](path[0].e(2), paths.length)
      var linePoints = pathToPolyline(path, deltX, deltY)
      var line = drawing.polyline(linePoints)
      line.fill("none").stroke({width:1, color: vectorToRGB(rgb)})
    };
    // for(nodeInd in path){
    //   var node = drawing.circle(8);
    //   node.attr({
    //     cx: ((nodeInd*1+ 0.5) * deltX),
    //     cy: ((pathInd*1+ 0.5) * deltY),
    //     fill: "#000"
    //   });
    // } 
  }

  // drawing.add(line)
/*  var $svg = $("<svg></svg>")
  $svg.attr("width",leng)
  $svg.attr("height",leng)
  for(pathInd in paths){
    var path = paths[pathInd]
    for(nodeInd in path){
      // console.log(pathInd, nodeInd)
      $vert = $("<circle />")
      $vert.attr("cx", ((nodeInd*1+ 0.5) * deltX))
      $vert.attr("cy", ((pathInd*1+ 0.5) * deltY))
      $vert.attr("r", 4)
      $vert.attr("fill", "black")
      $svg.append($vert)
    } 
  }
  $("body").append($svg)
*/
}

// for(var i = 3; i <101; i++){
//   console.log(2*i, shufflePath(1, 2*i).length)
//   console.log()
// };

/*
for deck M, 
the modulus is M-1=k, 
k is odd. 
at some point 2^N%k=1 
because there can be only k possible values of 2^N%k
when M is a power of 2^J, k is now 2^J-1, so 2^N%(2^J-1)=1 when N=J
*/