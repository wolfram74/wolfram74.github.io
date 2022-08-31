$('document').ready(function(){
  console.log('prepped')
  $('form').on('submit', formListener)
})

var formListener = function(event){
  event.preventDefault()
  var data = $(event.target).serializeArray()
  for(var index= 0; index<data.length; index++){
    var field = data[index]
    $('.madlib').find(field.name).text(field.value)
  }
  $('.madlib').show()
  $('.input').hide()
}
