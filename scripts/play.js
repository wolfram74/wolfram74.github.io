// var dooble = prompt("input please");
// document.write("butts"+dooble);

var x_y_vec = [100, 100];
var blocks = [];
var len = 25;

var make_at = function (x, y){
  var div = document.createElement("div");
  var mrg = 2
  div.style.width = len-2*mrg + "px";
  div.style.height = len-2*mrg + "px";
  div.style.border = mrg + "px solid";
  div.style.background = "gray";
  div.style.position = "absolute";
  div.style.left = x*len+"px";
  div.style.top = y*len+"px";
  div.style.zIndex = 0;
  document.body.appendChild(div);
  blocks.push(div);
}


var sdiv = document.createElement("div");
sdiv.style.width = len + "px";
sdiv.style.height = len + "px";
sdiv.style.background = "red";
sdiv.style.position = "absolute";
sdiv.style.left = x_y_vec[0]*len+"px";
sdiv.style.top = x_y_vec[1]*len+"px";
sdiv.style.zIndex = 1;

document.body.appendChild(sdiv);

function move(evnt) {
  // 39 for right arrow
  if (evnt.keyCode === 39) {
    x_y_vec[0]+=50;
  }
  // 37 for left arrow
  if (evnt.keyCode === 37) {
    x_y_vec[0]-=50;
  }
  // 40 for down arrow
  if (evnt.keyCode === 40) {
    x_y_vec[1]+=50;
  }
  // 38 for up arrow
  if (evnt.keyCode === 38) {
    x_y_vec[1]-=50;
  }
  // console.log("moved")
  update();
}

var update = function(){
  sdiv.style.left = x_y_vec[0]+"px";
  sdiv.style.top = x_y_vec[1]+"px";
}

for (var x = 0; x < 10; x++) {
  for (var y = 0; y < 18; y++) {
    make_at(x,y)
  };
};
// make_at(2,0)
// make_at(0,2)

document.onkeydown = move;
