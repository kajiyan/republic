/**
 * Animator
 */
var Animator = (function() {
  function Animator(options) {
    console.log('[Animator]');

    if (typeof options === 'undefined' || options === null) options = {};

    var defaults = {
      frameRate: 60,
      setup: function() { console.log('setup'); },
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
      this.setupProcess = options.setup;
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
    this.setupProcess();
    this._start();
  };

  /**
   * Animator#_start
   */
  Animator.prototype._start = function() {
    // console.log('[Animator] _start');

    this.process = window.requestAnimationFrame((function(_this) {
      return function() {
        _this._start();
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
   * Animator#setSetupProcess
   * @param {Function}
   */
  Animator.prototype.setSetupProcess = function(process) {
    console.log('[Animator] setSetupProcess');
    this.setupProcess = process;
  };

  /**
   * Animator#getSetupProcess
   * @param {Function}
   */
  Animator.prototype.getSetupProcess = function() {
    console.log('[Animator] getSetupProcess');
    return this.setupProcess;
  };

  /**
   * Animator#setUpdateProcess
   * @param {Function}
   */
  Animator.prototype.setUpdateProcess = function(process) {
    console.log('[Animator] setUpdateProcess');
    this.updateProcess = process;
  };

  /**
   * Animator#getUpdateProcess
   * @param {Function}
   */
  Animator.prototype.getUpdateProcess = function() {
    console.log('[Animator] getUpdateProcess');
    return this.updateProcess;
  };

  /**
   * Animator#setDrawProcess
   * @param {Function}
   */
  Animator.prototype.setDrawProcess = function(process) {
    console.log('[Animator] setDrawProcess');
    this.drawProcess = process;
  };

  /**
   * Animator#getDrawProcess
   * @param {Function}
   */
  Animator.prototype.getDrawProcess = function(process) {
    console.log('[Animator] getDrawProcess');
    return this.drawProcess;
  };

  return Animator;
})();