console.log('linked')
$('document').ready(function(){
  $('textarea').on('keyup', efficientAreaHandler)
})

var areaHandler = function(event){
  var text = event.target.value
  // console.log(text)
  console.log('counting')
  var spaces = text.split(' ').length
  $('#present').attr('value', spaces)
  var goal = $('#goal')[0].value
  var progress = spaces / goal
  // console.log(progress, goal)
  if( progress > 1){
    $('input').css('border', 'solid 5px #0f0')
  } else if(progress > .5){
    $('input').css('border', 'solid 5px #077')
  }
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var efficientAreaHandler = debounce(areaHandler, 250)
