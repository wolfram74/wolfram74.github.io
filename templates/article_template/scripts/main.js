$(document).on('ready', function(){
  console.log('ready')
  if(typeof MathJax !== 'undefined'){
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [["$&","&$"]]}
      });
  }
});

