(function(){
  'use strict';

  // --------------------------------------------------
  var Animator = (function() {
    /**
     * Animator
     */
    function Animator(options) {
      console.log('[Animator]');

      if (typeof options === 'undefined' || options === null) options = {};

      var defaults = {
        frameRate: 60,
        update: function() {},
        draw: function() {}
      };

      for (var key in defaults) {
        if (options[key] == null) options[key] = defaults[key];
      }

      if (
        (typeof options.frameRate === 'number' && options.frameRate > 0) && 
        typeof options.update === 'function' &&
        typeof options.update === 'function'
      ) {
        this.process;
        this.startTime = 0;
        this.oldFrame = 0;
        this.currentFrame = 0;
        this.frameRate = options.frameRate;
        this.updateProcess = options.update;
        this.drawProcess = options.draw;
      } else {
        throw new Error('[Animator] constructor | "updateProcess" and "drawProcess" of the argument is required');
      }
    }

    var _getTime = function() {
      var now = window.perfomance &&(perfomance.now || perfomance.webkitNow || perfomance.mozNow || perfomance.msNow || perfomance.oNow);
      return (now && now.cell(perfomance)) || (new Date().getTime());
    };

    /**
     * Animator#start
     */
    Animator.prototype.start = function() {
      // console.log('[Animator] start');

      this.process = window.requestAnimationFrame((function(_this) {
        return function() {
          _this.start();
        };
      })(this));

      this.currentFrame = Math.floor((_getTime() - this.startTime) / (1000 / this.frameRate) % 2);

      if (this.currentFrame !== this.oldFrame) {
        this.updateProcess();
        this.drawProcess();
      }

      this.oldFrame = this.currentFrame;
    };

    /**
     * Animator#stop
     */
    Animator.prototype.stop = function() {
      console.log('[Animator] stop');
      window.cancelAnimationFrame(this.process);
    };

    /**
     * Animator#setFrameRate
     */
    Animator.prototype.setFrameRate = function(frameRate) {
      console.log('[Animator] setFrameRate');
      this.frameRate = frameRate;
    };

    /**
     * Animator#getFrameRate
     * @return {number} - frameRate
     */
    Animator.prototype.getFrameRate = function(frameRate) {
      console.log('[Animator] getFrameRate');
      return this.frameRate;
    };

    /**
     * Animator#setUpdateProcess
     */
    Animator.prototype.setUpdateProcess = function(process) {
      console.log('[Animator] setUpdateProcess');
      this.updateProcess = process;
    };

    /**
     * Animator#setDrawProcess
     * 
     */
    Animator.prototype.setDrawProcess = function(process) {
      console.log('[Animator] setDrawProcess');
      this.drawProcess = process;
    };

    return Animator;
  })();
  // --------------------------------------------------

  /**
   * Gesture
   */
  /**
   * Mouse Object
   * @prop {number} x - ポインターのx座標
   * @prop {number} y - ポインターのy座標
   * @prop {number} px - ひとつ前のポインターのx座標
   * @prop {number} py - ひとつ前のポインターのy座標
   * {
   *   x: 0,
   *   y: 0,
   *   px: 0,
   *   py: 0,
   *   isClicked: false,
   *   isDragged: false,
   *   pressed: {
   *     _is: false,
   *     button: 0
   *   }
   * }
   */
  var Gesture = (function() {
    var _options = {};

    function Gesture(options) {
      console.log('[Gesture]');

      if (typeof options === 'undefined' || options === null) options = {};

      var defaults = {
        frameRate: 60,
        el: window,
        coordinate: 'offset' // 'client', 'screen', 'offset'
      };

      for (var key in defaults) {
        if (options[key] == null) options[key] = defaults[key];
      }

      _options = options;
      console.log(_options);

      this.process;
      this.startTime    = 0;
      this.oldFrame     = 0;
      this.currentFrame = 0;

      this._x  = 0; // 現在のポインター x座標
      this._y  = 0; // 現在のポインター y座標
      this._px = 0; // ひとつ前のポインター x座標
      this._py = 0; // ひとつ前のポインター y座標
      this._isDragged = false; // ドラッグ状態であるか

      // 現在のポインター座標とひとつ前の座標を保持する配列
      this.points = [
        { x: this._x,  y: this._y  }, // before
        { x: this._px, y: this._py }  // after
      ];

      _options.el.addEventListener('mousedown', this, false);
      _options.el.addEventListener('mousemove', this, false);
      _options.el.addEventListener('mouseup', this, false);
      _options.el.addEventListener('wheel', this, false);
      // _options.el.addEventListener('dragstart', this, false);
      // _options.el.addEventListener('drag', this, false);
      // _options.el.addEventListener('drop', this, false);
      // _options.el.addEventListener('dragenter', this, false);
      // _options.el.addEventListener('dragover', this, false);
      // _options.el.addEventListener('dragend', this, false);
      // document.addEventListener('contextmenu', this, false);

      this.record();
    }

    // --------------------------------------------------
    var _getTime = function() {
      var now = window.perfomance &&(perfomance.now || perfomance.webkitNow || perfomance.mozNow || perfomance.msNow || perfomance.oNow);
      return (now && now.cell(perfomance)) || (new Date().getTime());
    };

    // --------------------------------------------------
    Gesture.prototype.record = function (e) {
      // console.log('[Gesture] record');

      this.process = window.requestAnimationFrame((function(_this) {
        return function() {
          _this.record();
        };
      })(this));

      this.currentFrame = Math.floor((_getTime() - this.startTime) / (1000 / this.frameRate) % 2);

      if (this.currentFrame !== this.oldFrame) {
        this.points.push({
          x: this._x,
          y: this._y
        });
        this.points.shift();
      }

      this.oldFrame = this.currentFrame;
    };

    // --------------------------------------------------
    Gesture.prototype.handleEvent = function (e) {
      e.preventDefault();

      this._x = e[_options.coordinate + 'X'];
      this._y = e[_options.coordinate + 'Y'];

      switch (e.type) {
        case 'mousedown':
          this._isDragged = true;
          break;
        case 'mouseup':
          this._isDragged = false;
          break;
      }

      

      // this.points.push({
      //   x: e[_options.coordinate + 'X'],
      //   y: e[_options.coordinate + 'Y']
      // });
      // this.points.shift();
    };

    // --------------------------------------------------    
    /**
     * Gesture#release
     */
    Gesture.prototype.release = function() {
      console.log('[Gesture] release');
      window.cancelAnimationFrame(this.process);
    };

    // --------------------------------------------------
    /**
     * getX
     * ポインターの現在の x座標を返す
     * @return {number}
     */
    Gesture.prototype.getX = function() {
      return this.points[1].x;
    };

    // --------------------------------------------------
    /**
     * getY
     * ポインターの現在の y座標を返す
     * @return {number}
     */
    Gesture.prototype.getY = function() {
      return this.points[1].y;
    };

    // --------------------------------------------------
    /**
     * getPX
     * ポインターのひとつ前の x座標を返す
     * @return {number}
     */
    Gesture.prototype.getPX = function() {
      return this.points[0].x;
    };

    // --------------------------------------------------
    /**
     * getPY
     * ポインターのひとつ前の y座標を返す
     * @return {number}
     */
    Gesture.prototype.getPY = function() {
      return this.points[0].y;
    };

    // --------------------------------------------------
    /**
     * getIsDragged
     * ポインターがドラッグ状態かを返す
     * @return {bool}
     */
    Gesture.prototype.getIsDragged = function() {
      return this._isDragged;
    };

    return Gesture;
  })();



  // --------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');

    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.backgroundColor = '#cccccc';
    document.body.appendChild(canvas);

    var gesture = new Gesture({
      el: canvas
    });
    var animator = new Animator({
      frameRate: 60
    });

    var points = new Array();
    var pointsMemory = new Array();
    var pointsIsInsert = false;
    var pointsMax = 6 * animator.getFrameRate();

    var ctx = canvas.getContext('2d');
    
    animator.setUpdateProcess(function() {
      if (gesture.getIsDragged()) {
        if (!pointsIsInsert) {
          pointsIsInsert = true;
          points.splice(0, points.length);
        }

        // 座標が変わっていれば配列に座標を記録させる
        var lastPoint = points[points.length - 1];
        if (typeof lastPoint === 'undefined' || lastPoint === null) {
          points.push({ x: gesture.getX(), y: gesture.getY() });
        } else if (lastPoint.x !== gesture.getPX() || lastPoint.y !== gesture.getPY()) {
          points.push({ x: gesture.getX(), y: gesture.getY() });
        }
      } else {
        if (pointsIsInsert) {
          pointsMemory = [].concat(points);
          pointsIsInsert = false;
        }
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

      // --------------------------------------------------
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 255, 0, 1.0)';
      for (var offset = 1, i = offset, len = pointsMemory.length; i < len; i++) {
        ctx.moveTo(pointsMemory[0].x, pointsMemory[0].y);
        ctx.lineTo(pointsMemory[i - offset].x, pointsMemory[i - offset].y);
        ctx.lineTo(pointsMemory[i].x, pointsMemory[i].y);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // --------------------------------------------------
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 0, 0, 1.0)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;

      ctx.beginPath();
      for (var offset = 1, i = offset, len = points.length; i < len; i++) {
        ctx.moveTo(points[i - offset].x, points[i - offset].y);
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    animator.start();

    


  }, false);
})();














































































































