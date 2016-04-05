$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('.grid').each(Grid.createFromElement)
});
var eCon = Math.E
var mod = function(n, m){
  return ((n%m)+m)%m
}

var Grid = function(options){
  options = this.defaults(options)
  this.cellSize = options.cellSize
  this.height = options.height
  this.width = options.width
  this.cells = this.initCells()
  this.$div = options.div
  this.temperature = 1
  this.bField = 0
  this.mu = 5
  this.auto = false
}

Grid.prototype.defaults = function(options){
  if(options === undefined){
    options = {}
  };
  if(options.width === undefined){
    options.width = 100
  }
  if(options.height === undefined){
    options.height = 100
  }
  if(options.cellSize === undefined){
    options.cellSize = 4
  }
  return options
};

Grid.prototype.initCells = function(){
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
Grid.prototype.update = function(){
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      var cell = this.cells[rowI][colI]
      var neighbors = this.countNeighbors(colI, rowI)
      // console.log(neighbors)
      cell.update(neighbors, this.temperature, this.mu, this.bField)
    }
  }
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      var cell = this.cells[rowI][colI]
      cell.step()
    }
  }
}

Grid.prototype.countNeighbors = function(xInd, yInd){
  var neighbors = 0
  for(var dx=-1; dx<2; dx++){
    for(var dy=-1; dy<2; dy++){
      if(dx!=0 && dy!=0){
        var nx = mod(xInd + dx, this.width)
        var ny = mod(yInd + dy, this.height)
        neighbors += this.cells[ny][nx].spin
      }
    }
  }
  return neighbors
}

Grid.prototype.draw = function(){
  var $canvas = this.$div.find('canvas')
  var context = $canvas[0].getContext('2d')
  this.drawCells(context)
  this.drawGrid(context)
  // console.time('updateCycle')
  this.update()
  // console.timeEnd('updateCycle')
  setTimeout(this.draw.bind(this), 333)
}

Grid.prototype.drawCells = function(context){
  for(var rowI=0; rowI < this.height; rowI ++){
    for(var colI=0; colI < this.width; colI++){
      var cell = this.cells[rowI][colI]
      context.fillStyle = cell.color()
      var rad = this.cellSize/2
      context.beginPath()
      context.arc(colI*this.cellSize + rad, rowI*this.cellSize + rad,
        rad*.8, 0, 2*Math.PI)
      context.fill()
      context.closePath()
    }
  }
}

Grid.prototype.drawGrid = function(context){
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

Grid.prototype.slideListener = function(event){
  var $input = $(event.target)
  var property = $input.attr('name')
  var value = $input.val()
  this[property] = property.indexOf('bField') > -1 ? (value-50)/50 : value
  if('bField'===property){
    this.$div.find('.'+property+'_display').text(this[property])
  }else{
    var out = this[property] + ' or ' + this[property]/this.mu + ' spin energy'
    this.$div.find('.'+property+'_display').text(out)
  }
}
Grid.prototype.checkListener = function(event){
  var $input = $(event.target)
  var property = $input.attr('name')
  var value = $input.prop('checked')
  this[property] = value
  this.$div.find('.'+property+'_display').text(value)
}

Grid.createFromElement = function(number, domElement){
  console.log('you mangy tosser')
  var $div = $(domElement)
  var sample = new Grid({div: $div})
  sample.$div.find('canvas').attr(
    'width', sample.cellSize*(sample.width)
    )
  sample.$div.find('canvas').attr(
    'height', sample.cellSize*(sample.height)
    )
  $div.on('change', 'input[type=range]', sample.slideListener.bind(sample))
  $div.on('change', 'input[type=checkbox]', sample.checkListener.bind(sample))
  // debugger
  sample.draw()
}

var Cell = function(){
  this.spin = parseInt(Math.random()*2) ? 1 : -1
  this.next = null
};

Cell.prototype.update = function(difference, temperature, mu, bField){
  var eUp = -mu*(difference + bField)/temperature
  var zUp = Math.pow(eCon, -eUp)
  var zDown = Math.pow(eCon, +eUp)
  var threshold = zUp/(zUp + zDown)
  this.next = Math.random() < threshold ? 1 : -1
};

Cell.prototype.step = function(){this.spin = this.next; this.next = null}

Cell.prototype.color = function(){
  return this.spin+1 ? 'rgb(0,0,255)' : 'rgb(255,0,0)'
}

/*
notes on field object
behavior in 2d and 1d case, rough draft have it as seperate functionality, maybe a refactor will be obvious later.
borrow a lot/some of code from townsend breakdown.
control variables: temperature and externalB
auto-pilot mode: cycles through low and temp mode smoothly to display subdomains form and disolve.
*/
