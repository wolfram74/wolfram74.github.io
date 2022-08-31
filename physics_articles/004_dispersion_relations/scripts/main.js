// http://www.softsynth.com/webaudio/tone.php maybe?
// http://patorjk.com/blog/2012/07/22/tone-playing-experiment-with-html5s-web-audio-api/
var soundBoard = {440:{o:[],g:[]},554:{o:[],g:[]},659:{o:[],g:[]}}
$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"]]}
    });
  $('.audio_control').on('click', 'input', audioControlListener)
  $('.example_control').on('click', 'input', exampleControlListener)
  prepsoundBoard()
});
var audCtxt = new window.AudioContext()
var prepsoundBoard = function(){
  var chord = [440, 554, 659]
  for(var note in soundBoard){
    for(var mode = 0; mode < 14; mode++){
      soundBoard[note].o.push(audCtxt.createOscillator())
      soundBoard[note].o[mode].frequency.value = note*(1+mode)
      soundBoard[note].g.push(audCtxt.createGain())
      soundBoard[note].g[mode].gain.value = 0
      soundBoard[note].o[mode].connect(soundBoard[note].g[mode])
      soundBoard[note].g[mode].connect(audCtxt.destination)
      soundBoard[note].o[mode].start(1)
    }
    // test(chord[note])
  }
}
var audioControlListener = function(event){
  event.preventDefault()
  var $target = $(event.target)
  console.log('howdy')
  var notes = parseNotes($target.parent().attr('id'))
  window[$target.val()](notes)
}

var exampleControlListener = function(event){
  event.preventDefault()
  var $target = $(event.target)
  var $div = $target.parent('div')
  var type = $div.attr('class').split(' ')[1]
  var notes = parseNotes($div.attr('id'))
  var distance = 1*$div.find('.distance').val()
  notes = timeCalculator(type, notes, distance)
  window[$target.val()](notes)
}

var play = function(notes){
  //notes should be [note, mode, delay=0] pairs
  for(var note = 0; note < notes.length; note++){
    var root = notes[note][0]
    var mode = notes[note][1]
    var delay = notes[note][2] || 0
    setTimeout(
      function(root, mode){
        soundBoard[root].g[mode].gain.value = (2+Math.cos(Math.PI*(mode+1)/2))/Math.pow(3*(mode+1), .5)
        decay(root, mode)
      }.bind(null, root, mode),
      delay
    )
  }
}

var parseNotes = function(string){
  var notes = []
  var roots = string.split('&')
  for(var set = 0; set < roots.length; set ++){
    if(roots[set].split('-')[1]==='all'){
      for(var mode = 0; mode < 14; mode++){
        notes.push([1*roots[set].split('-')[0], mode])
      }
    } else {
      notes.push([1*roots[set].split('-')[0], 1*roots[set].split('-')[1]])
    }
  }
  return notes
};

var stop = function(){
  console.log('stawp!')
  for(var note in soundBoard){
    for(var mode = 0; mode < soundBoard[note].o.length; mode++){
      soundBoard[note].g[mode].gain.value = 0
    }
  }
}
1234567890
var decay = function(note, mode){
  if(soundBoard[note].g[mode].gain.value<.001){
    soundBoard[note].g[mode].gain.value = 0
  }else{
    soundBoard[note].g[mode].gain.value *= Math.pow(.90, mode+1)
    setTimeout(function(){decay(note, mode)}, 100)
  }
}

var k = function(omega){
  return omega/340
}

var deepWaterV = function(k){
  return Math.pow(680000/k, 0.5)
}

var matterV = function(k){
  return 57.8 * k
}

var timeCalculator = function(waveType, notes, distance){
  var times = []
  minimum = 100
  for(var i= 0; i < notes.length; i ++){
    var ki = k( notes[i][0]*(notes[i][1]+1) )
    times.push( distance / window[waveType](ki))
    if (times[i] < minimum){minimum = times[i]}
  }
  for(var i= 0; i < notes.length; i ++){
    times[i]-= minimum
    notes[i].push(times[i]*1000)
  }
  return notes
};

var test = function(fundamental){
  tones = []
  gains = []
  for(var i = 0; i < 7; i++){
    tones.push(audCtxt.createOscillator())
    tones[i].frequency.value = fundamental*(i+1)
    gains.push(audCtxt.createGain())
    gains[i].gain.value = 1/Math.pow((i+1), 2)
    tones[i].connect(gains[i])
    gains[i].connect(audCtxt.destination)
    tones[i].start(1)
  }
  // osc = audCtxt.createOscillator();
  // osc.frequency.value = 220;
  // gainNode = audCtxt.createGain()
  // osc.connect(gainNode)
  // gainNode.connect(audCtxt.destination)
  // osc.start(1)
}

// "notes
// speed of sound 340
// w/k = 340
// k = w/340"
