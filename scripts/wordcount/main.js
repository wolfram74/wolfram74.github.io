console.log('linked')
$('document').ready(function(){
  $('textarea').on('keyup', areaHandler)
})

var areaHandler = function(event){
  var text = event.target.value
  // console.log(text)
  var spaces = text.split(' ').length
  $('#present').attr('value', spaces)
  var progress = spaces / $('#goal').attr('value')
  if( progress > 1){
    $('input').css('border', 'solid 5px #0f0')
  } else if(progress > .5){
    $('input').css('border', 'solid 5px #077')
  }
}
