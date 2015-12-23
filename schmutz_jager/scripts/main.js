$(document).ready(function(){
  var thisWeek = makeActive(weekNum());
  var row = $('<tr></tr>')
  Handlebars.registerPartial('taskPartial', $('#taskTemplate').html())
  var spaceTemplate = Handlebars.compile($('#spaceTemplate').html())
  for(var room in thisWeek){
    var cell = $(spaceTemplate(thisWeek[room]))
    console.log(cell)
    row.append(cell)
  };
  $('table').append(row)
})
console.log('get eet done')

function weekNum(){
  var monday = new Date(2007, 0, 1);
  var now = new Date();
  var delta = now.valueOf() - monday.valueOf();
  var weekMiliSeconds = 7*24*3600*1000;
  return parseInt(delta/weekMiliSeconds);
}

function makeActive(number){
  var cycle = number % 4;
  var activeSpaces = {};
  var offSet = 0;
  for(var room in spaces){
    var residentNumber = (number+offSet)%3
    activeSpaces[room] = {person: residents[residentNumber], tasks: [], location: room}
    for(var i =0; i < spaces[room].tasks.length; i++){
      var task = spaces[room].tasks[i];
      if(cycle%task.weekPeriod === 0){
        activeSpaces[room].tasks.push(task)
      };
    };
    offSet+=1
  }
  return activeSpaces
}
