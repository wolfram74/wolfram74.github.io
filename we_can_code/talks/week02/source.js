$('document').ready(function(){
  console.log('prepped')
  $('body').on('keydown', keyListener)
  lastSlide = $('.slide').length
  console.log(lastSlide)
  tree = new Treant(domStructure)
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

var formChildren = [
    {text: {name:'SPAN'}},
    {text: {name:'INPUT'}},
    {text: {name:'SPAN'}},
    {text: {name:'INPUT'}},
    {text: {name:'INPUT'}}
]

var div = {
  text:{name:'DIV'},
  collapsed: true,
  children:[
    {text: {name:'H1'}},
    {
      text: {name:'FORM'},
      collapsed: true,
      children: formChildren
    }
  ]
}


var domStructure = {
  chart:{
    container: '#dom-example',
    mode: {collapsable: true},
    nodeAlign: 'BOTTOM',
    animation: {
      nodeAnimation: 'easeOutBounce',
      nodeSpeed: 700,
      connectorsAnimation: 'bounce'
    },
    animateOnInit: true
  },
  nodeStructure:{
    text: {name:'HTML'},
    children: [
      {
        text: {name:'HEAD'},
        collapsed: true,
        children: [{text: {name: 'TITLE'}}]
      },
      {
        text: {name:'BODY'},
        collapsed: true,
        children: [
          div
        ]
      }
    ]
  }
}

