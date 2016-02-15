/**
 * Gesture
 */
var Gesture = (function() {
  var _options = {};
  var slice = [].slice;

  function Gesture(options) {
    console.log('[Gesture]');

    if (typeof options === 'undefined' || options === null) options = {};

    var defaults = {
      frameRate: 60,
      el: window,
      holdThreshold: 40,
      coordinate: 'offset', // 'client', 'screen', 'offset'
      pointerDown: function() {},
      pointerUp: function() {},
      pointerDownHold: function() {}
    };

    for (var key in defaults) {
      if (options[key] == null) options[key] = defaults[key];
    }

    _options = options;

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
        
        var point = {
          x: this._x,
          y: this._y,
          button: e.button
        };

        _options.pointerDown(point);

        this.holdTimer = setTimeout((function(_this) {
          return function() {
            var dx = point.x - _this._x,
                dy = point.y - _this._y;

            var diff = Math.sqrt((dx * dx) + (dy * dy));

            // ボタンを押し続けた状態で、特定の移動量以内の場合であれば
            // pointerDownHold イベントを発火させる
            if (_this._isDragged && diff <= _options.holdThreshold) {
              _options.pointerDownHold();
              _this.trigger('pointerDownHold', {
                x: _this._x,
                y: _this._y,
                button: e.button
              });
            }
          };
        }(this)), 1000);
        break;
      case 'mouseup':
        this._isDragged = false;
        _options.pointerUp({
          x: this._x,
          y: this._y,
          button: e.button
        });

        clearTimeout(this.holdTimer);
        break;
    }
  };

  // --------------------------------------------------
  /**
   * Gesture#getPointerDown
   * @return {Function}
   */
  Gesture.prototype.getPointerDown = function() {
    return _options.pointerDown
  };

  // --------------------------------------------------
  /**
   * Gesture#setMouseDown
   * @param {Function}
   */
  Gesture.prototype.setPointerDown = function(pointerDown) {
    _options.pointerDown = pointerDown;
  };

  // --------------------------------------------------
  /**
   * Gesture#getPointerUp
   * @return {Function}
   */
  Gesture.prototype.getPointerUp = function() {
    return _options.pointerUp
  };

  // --------------------------------------------------
  /**
   * Gesture#setPointerUp
   * @param {Function}
   */
  Gesture.prototype.setPointerUp = function(pointerUp) {
    _options.pointerUp = pointerUp;
  };

  // --------------------------------------------------
  /**
   * Gesture#getPointerDownHold
   * @return {Function}
   */
  Gesture.prototype.getPointerDownHold = function() {
    return _options.pointerDownHold
  };

  // --------------------------------------------------
  /**
   * Gesture#setPointerDownHold
   * @param {Function}
   */
  Gesture.prototype.setPointerDownHold = function(pointerDownHold) {
    _options.pointerDownHold = pointerDownHold;
  };

  // --------------------------------------------------    
  /**
   * Gesture#break
   */
  Gesture.prototype.break = function() {
    console.log('[Gesture] break');
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

  // --------------------------------------------------
  Gesture.prototype.on = function(event, callback) {
    if (this._callbacks == null) {
      this._callbacks = {};
    }
    
    var events = event.split(' ');

    for (var i = 0, len = events.length; i < len; i++) {
      var base,
          name = events[i];
      (base = this._callbacks)[name] || (base[name] = []);
      this._callbacks[name].push(callback);
    }
    
    return this;
  };

  // --------------------------------------------------
  Gesture.prototype.once = function(event, callback) {
    this.on(event, function() {
      this.off(event, arguments.callee);
      return callback.apply(this, arguments);
    });
    return this;
  };

  // --------------------------------------------------
  Gesture.prototype.trigger = function() {
    var args = 1 <= arguments.length ? slice.call(arguments, 0) : [],
        event = args.shift(),
        list = this._callbacks != null ? this._callbacks[event] : void 0;

    if (!list) return;

    for (var i = 0, len = list.length; i < len; i++) {
      callback = list[i];
      if (callback.apply(this, args) === false) break;
    }
    return this;
  };

  // --------------------------------------------------
  Gesture.prototype.off = function(event, callback) {
    if (!event) {
      this._callbacks = {};
      return this;
    }

    var events = event.split(' ');
    
    for (var i = 0, len0 = events.length; i < len0; i++) {
      var name = events[i]
          list = this._callbacks != null ? this._callbacks[name] : void 0;
      
      if (list) {
        if (callback) {
          for (var j = k = 0, len1 = list.length; k < len1; j = ++k) {
            cb = list[j];
            if (!(cb === callback)) {
              continue;
            }
            list = list.slice();
            list.splice(j, 1);
            this._callbacks[name] = list;
          }
        } else {
          delete this._callbacks[name];
        }
      }
    }
    return this;
  };

  return Gesture;
})();