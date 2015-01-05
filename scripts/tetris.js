/*
tetris
width along x-axis: 10
along y: 18
blocks move down, when 10 are aligned along x, they dissapear.
preprocessing: a background to define the space.
so perhaps 3 sets of blocks, background blocks, stationary blocks, active blocks.
an active block can be rotated, moved left to right, or moved down
will move down after some time t_step regardless.
if active block tries to move down, but stops being on top of background, or becomes ontop of stationary blocks, it does not move and instead becomes stationary and new active is given.

logic needed:
visualizing abstraciton
overlap check, does an active block overlap with background? with stationary?
has the allotted time passed?
move actives into stationary
delete stationary
*/

var background_blocks = [];
var stationary_blocks = [];
var active_blocks =[];
var len = 25;

function Block (x, y, z, color) {
  this.position = [x,y,z];
  this.color = color;
  this.color_string = "#"+this.color[0].toString(16) + this.color[1].toString(16) + this.color[2].toString(16);
  draw( this );
};

var draw = function (block){
  var div = document.createElement("div");
  var mrg = 2
  div.style.width = len-2*mrg + "px";
  div.style.height = len-2*mrg + "px";
  div.style.border = mrg + "px solid";
  div.style.background = block.color_string;
  div.style.position = "absolute";
  div.style.left = block.position[0]*len+"px";
  div.style.top = block.position[1]*len+"px";
  div.style.zIndex = block.position[2];
  document.body.appendChild(div);
  block.element = div
  // target.push(div);
  // console.log(x +" and "+ y)
}

for (var x = 0; x < 10; x++) {
  for (var y = 0; y < 18; y++) {
    background_blocks.push(new Block(x,y, 0, [109, 109, 109]) )
  };
};

// for (var i = 0; i < background_blocks.length; i++) {
//   draw(background_blocks[i])
// };



document.onkeydown

// var col = [255, 100, 25]
// var test = "#"+col[0].toString(16) + col[1].toString(16) + col[2].toString(16);
// console.log(test)