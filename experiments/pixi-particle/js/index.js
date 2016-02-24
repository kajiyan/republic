(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');

    var renderer = PIXI.autoDetectRenderer(
      window.innerWidth,
      window.innerHeight,
      {
        antialias: true,
        transparent: true,
        resolution: 1
      }
    );
    var stage = new PIXI.Container(); // create the root of the scene graph
    var graphics = new PIXI.Graphics();

    console.log(renderer.height);
    //  renderer.resize(width, height);
    // drawingArea.style.width = width + "px";
    // drawingArea.style.height = height + "px";

    var animator = new Animator({
      frameRate: 24
    });

    var particles = [];
    var particleNum = 100;

    // setup
    animator.setSetupProcess(function() {
      document.body.appendChild(renderer.view);

      // for (var i = 0; i < particleNum; i++) {
      //   var particle = new Particle({
      //     renderer: renderer,
      //     stage: stage,
      //     x: window.innerWidth / 2,
      //     y: window.innerHeight / 2
      //   });

      //   particles.push(particle);
      // }
    });

    animator.setUpdateProcess(function() {
      var offset = 0;
      for (var i = 0, len = particles.length; i < len; i++) {
        var index = i - offset;
        particles[index].update();
        if (particles[index].getLife() <= 0) {
          particles[index].remove();
          particles.splice(index, 1);
          offset++;
        }
      }

      // for (var i = 0; i < 4; i++) {
        var particle = new Particle({
          renderer: renderer,
          stage: stage,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });

        particles.push(particle);
      // }
    });

    animator.setDrawProcess(function() {
      for (var i = 0, len = particles.length; i < len; i++) {
        particles[i].draw();
      }

      renderer.render(stage);
    });

    animator.start();

  }, false)
})()