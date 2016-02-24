(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');

    var elConsole = document.querySelector('#console');
    console.log(elConsole);

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

    // renderer.resize(width, height);
    // drawingArea.style.width = width + "px";
    // drawingArea.style.height = height + "px";

    var animator = new Animator({
      // frameRate: 24
    });

    var particles = [];
    var particleNum = 100;

    // setup
    animator.setSetupProcess(function() {
      document.body.appendChild(renderer.view);

      for (var i = 0; i < particleNum; i++) {
        var particle = new Particle({
          renderer: renderer,
          stage: stage,
          graphics: graphics,
          radius: ~~(1 + (Math.random() * 8)),
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          points: new PIXI.Point(
            window.innerWidth / 2,
            window.innerHeight / 2
          ),
          life: ~~(1 + (Math.random() * 200))
        });

        particles.push(particle);
      }

      // graphics.lineStyle(0);
      // graphics.beginFill(0xFFFF0B, 0.5);
      // graphics.drawCircle(470, 200,100);
      // graphics.endFill();

      stage.addChild(graphics);
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

      // for (var i = 0; i < 10; i++) {
      //   var particle = new Particle({
      //     renderer: renderer,
      //     stage: stage,
      //     graphics: graphics,
      //     radius: ~~(1 + (Math.random() * 8)),
      //     x: window.innerWidth / 2,
      //     y: window.innerHeight / 2,
      //     life: ~~(1 + (Math.random() * 200))
      //   });

      //   particles.push(particle);
      // }

      elConsole.innerHTML = particles.length;

      graphics.clear();
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