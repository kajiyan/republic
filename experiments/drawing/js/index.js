(function(){
  'use strict';

  // --------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');

    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.backgroundColor = '#cccccc';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 640;
    compositeCanvas.height = 480;
    compositeCanvas.style.backgroundColor = '#cccccc';
    document.body.appendChild(compositeCanvas);
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
    
    gesture.on('pointerDownHold', function(e){
      console.log('pointerDownHold', e);
    });

    gesture.setPointerDown(function(e) {
      points.splice(0, points.length);
    });

    gesture.setPointerUp(function(e) {
      var pointsMemory = [].concat(points);

      // --------------------------------------------------
      compositeCtx.save();

      compositeCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
      compositeCtx.rect(0, 0, compositeCtx.canvas.width, compositeCtx.canvas.height);
      compositeCtx.fill();

      compositeCtx.beginPath();
      compositeCtx.fillStyle = 'rgba(255, 255, 255, 1.0)';
      for (var offset = 1, i = offset, len = pointsMemory.length; i < len; i++) {
        compositeCtx.moveTo(pointsMemory[0].x, pointsMemory[0].y);
        compositeCtx.lineTo(pointsMemory[i - offset].x, pointsMemory[i - offset].y);
        compositeCtx.lineTo(pointsMemory[i].x, pointsMemory[i].y);
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
      ctx.strokeStyle = 'rgba(255, 0, 0, 1.0)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    });

    // --------------------------------------------------
    animator.setUpdateProcess(function() {
      if (gesture.getIsDownHold() && gesture.getIsDragged()) {
        // 座標が変わっていれば配列に座標を記録させる
        var lastPoint = points[points.length - 1];
        if (typeof lastPoint === 'undefined' || lastPoint === null) {
          points.push({ x: gesture.getX(), y: gesture.getY() });
        } else if (lastPoint.x !== gesture.getPX() || lastPoint.y !== gesture.getPY()) {
          points.push({ x: gesture.getX(), y: gesture.getY() });
        }
      } else {
        // 後ろから配列を空にしていく
        points.shift();
      }

      if (points.length > pointsMax) {
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














































































































