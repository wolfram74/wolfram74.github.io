$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('.discharge').each(Vessel.createFromElement)
});

var Vessel = function(options){
  options = this.defaults(options)
  this.cellSize = options.cellSize
  this.height = options.height
  this.width = options.width
  this.cells = this.initCells()
  this.$div = options.div
  this.voltage = 0
  this.alpha = 0
  this.gamma = 0
}

Vessel.prototype.defaults = function(options){
  if(options === undefined){
    options = {}
  }
  if(options.width === undefined){
    options.width = 30
  }
  if(options.height === undefined){
    options.height = 10
  }
  if(options.cellSize === undefined){
    options.cellSize = 15
  }
  return options
}

Vessel.prototype.initCells = function(){
  var bins = []
  for(var rowI=0; rowI < this.height; rowI ++){
    var row = []
    for(var colI=0; colI < this.width; colI++){
      row.push(new Cell())
    }
    bins.push(row)
  }
  return bins
}

Vessel.prototype.updatePlates = function(){
  for(var rowI=0; rowI < this.height; rowI ++){
    this.cells[rowI][0].e0 += Math.random()*10
    this.cells[rowI][this.width-1].e0 += Math.random()*10
    this.cells[rowI][0].e0 *= .9
    this.cells[rowI][this.width-1].e0 *= .9
  }
}

Vessel.prototype.driftCells = function(){
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      var nowCell = this.cells[rowI][colI]
      if(colI != this.width-1){
        this.cells[rowI][colI+1].e1 = nowCell.e0
      }else{
        // nowCell.e1 = 0
      }
      if(colI != 0){
        this.cells[rowI][colI-1].i1 = nowCell.i0
      }else{
        // nowCell.i1 = 0
      }
    }
  }

};

Vessel.prototype.alphaProc = function(){
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      var nowCell = this.cells[rowI][colI]
      var collisions = nowCell.e0*(this.voltage*this.alpha/48400)
      if(colI != this.width-1){
        for(var d= -1; d < 2; d++){
          this.cells[mod(rowI+d, this.height)][colI+1].e1 += collisions
          this.cells[mod(rowI+d, this.height)][colI+1].i1 += collisions
        }
      }
    }
  }
};

Vessel.prototype.gammaProc = function(){
  for(var rowI=0; rowI < this.height; rowI ++){
    var nowCell = this.cells[rowI][0]
    var sputters = nowCell.i0*(this.voltage*this.gamma/10000)
    nowCell.e1 += sputters
  }
}

Vessel.prototype.updateCells = function(){
  this.driftCells()
  this.alphaProc()
  this.gammaProc()
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      this.cells[rowI][colI].update()
    }
  }
};

Vessel.prototype.controlListener = function(event){
  var $input = $(event.target)
  var that = $input.attr('name')
  var theOtherThing = $input.val()
  this[that] = theOtherThing
  this.$div.find('.'+that+'_display').text(theOtherThing)
};

Vessel.prototype.draw = function(){
  var $canvas = this.$div.find('canvas')
  var context = $canvas[0].getContext('2d')
  this.drawBorders(context)
  this.drawCells(context)
  this.drawGrid(context)
  this.updatePlates()
  setTimeout(this.draw.bind(this), 35)
}

Vessel.prototype.moveCells = function(){
  this.updateCells()
  setTimeout(this.moveCells.bind(this), this.voltage ? Math.pow(122500/this.voltage, 0.5): 350)
}

Vessel.prototype.drawBorders = function(context){
  context.fillStyle = '#aaaaaa'
  context.beginPath()
  context.fillRect(
    0, 0,
    this.cellSize, this.cellSize*this.height)
  context.fillRect(
    (this.width+1)*this.cellSize, 0,
    this.cellSize, this.cellSize*this.height)
  context.closePath()

}

Vessel.prototype.drawCells = function(context){
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      var cell = this.cells[rowI][colI]
      context.fillStyle = cell.color()
      context.beginPath()
      context.fillRect(
        (colI+1)*this.cellSize, (rowI)*this.cellSize,
        this.cellSize, this.cellSize)
      context.closePath()
    }
  }
}

Vessel.prototype.drawGrid = function(context){
  context.fillStyle = '#000000'
  for(var i = 0; i < (this.height); i++){
    context.beginPath()
    context.moveTo(0, i*this.cellSize)
    context.lineTo((this.width+2)*this.cellSize , i*this.cellSize)
    context.stroke()
    context.closePath()
  }
  for(var i = 0; i < (this.width+2); i++){
    context.beginPath()
    context.moveTo(i*this.cellSize, 0)
    context.lineTo( i*this.cellSize, this.height*this.cellSize)
    context.stroke()
    context.closePath()
  }
}


Vessel.createFromElement = function(number, domElement){
  console.log('you mangy tosser')
  var $div = $(domElement)
  var chamber = new Vessel({div: $div})
  chamber.$div.find('canvas').attr(
    'width', chamber.cellSize*(chamber.width+2)
    )
  chamber.$div.find('canvas').attr(
    'height', chamber.cellSize*(chamber.height)
    )
  $div.on('change', 'input', chamber.controlListener.bind(chamber))
  // debugger
  chamber.draw()
  chamber.moveCells()
}

var Cell = function(){
  this.e0 = 0
  this.e1 = 0
  this.i0 = 0
  this.i1 = 0
};

Cell.prototype.update = function(){
  this.e0 = this.e1
  this.i0 = this.i1
  this.e1 = 0
  this.i1 = 0
};

Cell.prototype.color = function(){
  var max = 512
  var efrac = max >= this.e0 ? this.e0/max : 1
  var ifrac = max >= this.i0 ? this.i0/max : 1
  var ecol = 255 * (1 - efrac)
  var icol = 255 * (1 - ifrac)
  var evec = [ecol, ecol, 255]
  var ivec = [255, icol, icol]
  var out = [
    parseInt((evec[0]+ivec[0])/2),
    parseInt((evec[1]+ivec[1])/2),
    parseInt((evec[2]+ivec[2])/2)
    ]
  return 'rgb('+out[0]+','+out[1]+','+out[2]+')'
}
var mod = function(n, m){
  return ((n%m)+m)%m
}
