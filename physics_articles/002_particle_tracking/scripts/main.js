$(document).on('ready', function(){
  console.log('ready')
  MathJax.Hub.Config({
      tex2jax: {inlineMath: [["$&","&$"],["<mj>","</mj>"]]}
    });
});

