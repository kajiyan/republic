/**
 * Particle
 */
var Particle = (function() {

  // --------------------------------------------------
  /**
   * Particle
   */
  function Particle(options) {
    // console.log('[Particle]');

    if (typeof options === 'undefined' || options === null) options = {};

    var defaults = {
      renderer: {},
      stage: {},
      radius: ~~(1 + (1 * Math.random() * 10)),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 10 * (Math.random() - 0.5),
      vy: 10 * (Math.random() - 0.5),
      angle: (Math.random() * (Math.PI * 2)) * Math.random(),
      friction: 0.002, // 摩擦係数
      life: 100
    };

    for (var key in defaults) {
      if (options[key] == null) options[key] = defaults[key];
    }

    if (
      options.stage instanceof PIXI.Container
    ) {
      this._options = options;

      this._renderer = this._options.renderer;
      this._stage = this._options.stage;

      this._radius = this._options.radius;

      // 初期位置
      this._x = this._options.x;
      this._y = this._options.y;

      // 寿命
      this.life = this._options.life;

      // 角度
      this._angle = this._options.angle;

      // 速度
      // this._vx = this._options.vx;
      // this._vy = this._options.vy;
      this._vx = Math.cos(this._angle);
      this._vy = Math.sin(this._angle);

      this._friction = this._options.friction;

      this.graphics = new PIXI.Graphics();

      this._stage.addChild(this.graphics);
    } else {
      throw new Error();
    //   throw new Error('[Particle] constructor | PIXI.Container instance of "options.stage" is required')
    }
  }

  // --------------------------------------------------
  /**
   * Particle#update
   */
  Particle.prototype.update = function () {
    // 重力
    // this._vy += 1.0;

    // 摩擦
    // this._x = Math.cos(this._radians) * this._vx;
    // this._y = -Math.sin(this._radians) * this._vy;
    
    // this._vx *= 0.95;
    // this._vy *= 0.95;

    var forceX = 0;
    var forceY = 0;

    forceX -= this._vx * this._friction;
    forceY -= this._vy * this._friction;

    // console.log(this._vy, this._friction);

    this._vx += forceX;
    this._vy += forceX;

    // 反映
    this._x += this._vx;
    this._y += this._vy;

    // 寿命を減らす
    this.life -= 1;

    if (this._y > this._renderer.height - this._radius) {
      this._y = this._renderer.height - this._radius; // 行き過ぎ補正
      this._vy *= -1; // Y軸の速度を反転
    }

    // if (this.life <= 0) {
    //   this._stage.removeChild(this.graphics);
    // }
  };

  // --------------------------------------------------
  /**
   * Particle#draw
   */
  Particle.prototype.draw = function () { 
    this.graphics.clear();
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0x000000);
    this.graphics.drawCircle(this._x, this._y, this._radius);
    this.graphics.endFill();
  };

  // --------------------------------------------------
  /**
   * Particle#remove
   */
  Particle.prototype.remove = function () {
    this._stage.removeChild(this.graphics);
  };

  // --------------------------------------------------
  /**
   * Particle#getLife
   * @return {number}
   */
  Particle.prototype.getLife = function () {
  ;
    return this.life;
  };

  return Particle;
})();
