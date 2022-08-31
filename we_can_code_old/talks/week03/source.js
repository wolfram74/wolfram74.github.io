$('document').ready(function(){
  console.log('prepped')
  $('body').on('keydown', keyListener)
  lastSlide = $('.slide').length
  console.log(lastSlide)
})

var slide = 1;
var lastSlide = 100;

var keyListener = function(event){
  var value = String.fromCharCode(event.keyCode)
  if(value === 'D' && slide <lastSlide){
    slide +=1
  }
  if(value === 'A' && slide > 1){
    slide-=1
  }
  if(value === 'A' || value === 'D'){
    $('html, body').animate({
      scrollTop: $("#slide"+slide).offset().top
    }, 250);
  }
}

