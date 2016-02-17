(function(){
  'use strict';

  // --------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');

    var borderOpen = false;
    var borderClose = false;
    var borderThreshold = 40;

    var content = document.querySelector('#js-content');

    // svg
    var progressSvg = document.querySelector('#svg-progress');
    var progressSvgWidth = progressSvg.getBoundingClientRect().width;
    var progressSvgHeight = progressSvg.getBoundingClientRect().height;
    TweenMax.set('#ok-before', { visibility: 'hidden' });
    TweenMax.set('#ok-after', { visibility: 'hidden' });

    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.backgroundColor = '#cccccc';
    content.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 640;
    compositeCanvas.height = 480;
    compositeCanvas.style.backgroundColor = '#cccccc';
    content.appendChild(compositeCanvas);
    var compositeCtx = compositeCanvas.getContext('2d');

    var gesture = new Gesture({
      el: canvas,
      frameRate: 24
    });

    var animator = new Animator({
      frameRate: 24
    });

    var filter = new Filter();

    var points = new Array();
    var pointsIsInsert = false;
    var pointsMax = 6 * animator.getFrameRate();
    
    // --------------------------------------------------
    gesture.on('pointerDownHold', function(e){
      console.log('pointerDownHold', e);

      progressSvg.style.transform = 'translate(' +
        (-(progressSvgWidth / 2) + gesture.getX()) + 'px, ' +
        (-(progressSvgHeight / 2) + gesture.getY()) + 'px)';

      // progress SVG を表示にする
      TweenMax.
        to(['#ng-before', '#ng-after'], 0.8,
          {
            scale: 1.0,
            transformOrigin:'50% 50%',
            shapeIndex: 0,
            ease: Elastic.easeInOut,
            immediateRender: false,
            onComplete: function() {}
          }
        );
    });


    // --------------------------------------------------
    gesture.setPointerDown(function(e) {
      console.log('pointerDown');
      points.splice(0, points.length);
    });


    // --------------------------------------------------
    gesture.setPointerUp(function(e) {
      console.log('pointerUp');

      // if (borderOpen && borderClose) {

      // }

      // progress SVG を非表示にする
      TweenMax.
        to(['#ng-before', '#ng-after'], 0.8,
          {
            scale: 0.0,
            transformOrigin:'50% 50%',
            shapeIndex: 0,
            ease: Elastic.easeInOut,
            immediateRender: false
          }
        );


      // --------------------------------------------------
      compositeCtx.clearRect(0, 0, compositeCtx.canvas.width, compositeCtx.canvas.height);

      compositeCtx.beginPath();
      compositeCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
      compositeCtx.rect(0, 0, compositeCtx.canvas.width, compositeCtx.canvas.height);
      compositeCtx.fill();
      compositeCtx.closePath();

      compositeCtx.beginPath();
      compositeCtx.fillStyle = 'rgba(255, 255, 255, 1.0)';
      for (var offset = 1, i = offset, len = points.length; i < len; i++) {
        compositeCtx.moveTo(points[0].x, points[0].y);
        compositeCtx.lineTo(points[i - offset].x, points[i - offset].y);
        compositeCtx.lineTo(points[i].x, points[i].y);
        compositeCtx.closePath();
        compositeCtx.fill();
      }

      filter.filterRGB({
        context: compositeCtx,
        topX: 0,
        topY: 0,
        width: compositeCtx.canvas.width,
        height: compositeCtx.canvas.height,
        iterations: 3,
        radius: 14
      });
    });

    // --------------------------------------------------
    animator.setSetupProcess(function() {
      // TweenMax.set(['#ng-before', '#ng-after'],
      //   {
      //     scale: 0.0,
      //     transformOrigin:'50% 50%'
      //   }
      // );

      // TweenMax.to('#ok-after', 2.0,
      //  {
      //    drawSVG: '0% 0%',
      //    ease: Linear.easeNone,
      //    immediateRender: false
      //  }
      // );

      TweenMax.set(['#ng-before', '#ng-after'],
        {
          scale: 0.0,
          transformOrigin:'50% 50%'
        }
      );

      ctx.strokeStyle = 'rgba(255, 0, 0, 1.0)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    });

    // --------------------------------------------------
    animator.setUpdateProcess(function() {        
      var pointLen = points.length;

      // ポインターがホールド状態になったらポイントを記録する
      if (gesture.getIsDownHold()) {
        progressSvg.style.transform = 'translate(' +
          (-(progressSvgWidth / 2) + gesture.getX()) + 'px, ' +
          (-(progressSvgHeight / 2) + gesture.getY()) + 'px)';

        // 座標が変わっていれば配列に座標を記録させる
        var lastPoint = points[pointLen - 1];

        if (typeof lastPoint === 'undefined' || lastPoint === null) {
          points.push({ x: gesture.getX(), y: gesture.getY() });
        } else if (lastPoint.x !== gesture.getPX() || lastPoint.y !== gesture.getPY()) {
          points.push({ x: gesture.getX(), y: gesture.getY() });
        }

        var dx = points[0].x - gesture.getX(),
            dy = points[0].y - gesture.getY(),
            diff = Math.sqrt((dx * dx) + (dy * dy));

        console.log(~~(diff));

        // if (~~(diff) > borderThreshold) {
        //   borderOpen = true;
        // } else if (~~(diff) <= borderThreshold && borderOpen) {
        //   borderClose = true;
        // } else if (~~(diff) > borderThreshold && borderOpen && borderClose) {
        //   borderClose = false;
        // }

        // if (borderOpen && borderClose) {
        //   TweenMax.to(['#ng-before', '#ng-after'], 0.8,
        //     {
        //       morphSVG: {
        //         shape: 'M26,50.5 C12.4909,50.5,1.5,39.5091,1.5,26S12.4909,1.5,26,1.5S50.5,12.4909,50.5,26S39.5091,50.5,26,50.5z'
        //       },
        //       rotation: 360,
        //       transformOrigin:'50% 50%',
        //       shapeIndex: 0,
        //       ease: Elastic.easeInOut,
        //       immediateRender: false
        //     }
        //   );
        // } else {

        // }

        TweenMax.set(['#ng-after'], {
          drawSVG: 100 - (~~(pointLen / pointsMax * 100)) + '%',
        });
      } else {
        // 後ろから配列を空にしていく
        points.shift();
      }

      if (pointLen > pointsMax) {
        points.shift();
      }

      // console.table(points);
    });

    animator.setDrawProcess(function() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // // --------------------------------------------------
      // ctx.save();
      // ctx.beginPath();
      // ctx.fillStyle = 'rgba(0, 255, 0, 1.0)';
      // for (var offset = 1, i = offset, len = pointsMemory.length; i < len; i++) {
      //   ctx.moveTo(pointsMemory[0].x, pointsMemory[0].y);
      //   ctx.lineTo(pointsMemory[i - offset].x, pointsMemory[i - offset].y);
      //   ctx.lineTo(pointsMemory[i].x, pointsMemory[i].y);
      //   ctx.closePath();
      //   ctx.fill();
      // }
      // ctx.restore();

      // // --------------------------------------------------
      // ctx.save();
      // ctx.strokeStyle = 'rgba(255, 0, 0, 1.0)';
      // ctx.lineCap = 'round';
      // ctx.lineJoin = 'round';
      // ctx.lineWidth = 2;

      // ctx.beginPath();
      // for (var offset = 1, i = offset, len = points.length; i < len; i++) {
      //   ctx.moveTo(points[i - offset].x, points[i - offset].y);
      //   ctx.lineTo(points[i].x, points[i].y);
      // }
      // ctx.closePath();
      // ctx.stroke();
      // ctx.restore();

      // --------------------------------------------------
      ctx.beginPath();
      for (var offset = 1, i = offset, len = points.length; i < len; i++) {
        ctx.moveTo(points[i - offset].x, points[i - offset].y);
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    });

    animator.start();

  }, false);
})();














































































































