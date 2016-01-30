// ============================================================
// Controllers Module
var Controllers = (function() {
  var config = require('config');
  var events = require('events');
  var _ = require('lodash');
  
  // --------------------------------------------------------------
  /**
   * Controllers
   * @constructor
   * @classdesc コントローラーを管理するクラス
   */
  function Controllers() {
    console.log('[Controllers] Index -> constructor');

    this.app;
    this.eventEmitter = new events.EventEmitter;

    this.controllers = {
      empty: (function() {
        var Empty = require(config.CONTROLLERS + 'empty');
        return new Empty();
      })()
    };
  }

  // --------------------------------------------------------------
  /**
   * Controllers setup
   * @param {string} modelName - 取得するモデルクラス名
   * @return {Object} 引数で指定したmodelNameのモデルクラスのインスタンスを返す
   */
  // --------------------------------------------------------------
  Controllers.prototype.setup = function(_options) {
    console.log('[Controllers] Index -> setup');

    // アプリケーションをセット
    this.app = module.parent.exports;

    var options = _.extend({
    }, _options);

    return new Promise((resolve, reject) => {
      for (var controllerName in this.controllers) {
        var controller = this.controllers[controllerName];
        controller.setup({
          'app': this.app
        });
      }
      resolve();
    });
  };


  // --------------------------------------------------------------
  /**
   * Controllers#getControllers
   * @param {string} controllersName - 取得するコントローラークラス名
   * @return {Object} 引数で指定したcontrollersNameのコントローラークラスのインスタンスを返す
   */
  Controllers.prototype.getControllers = function(controllersName) {
    console.log('[Controllers] Index -> getControllers', controllersName);
    
    var result = {};
    try {
      if (
        typeof this.controllers[controllersName] !== 'undefined' &&
        this.controllers[controllersName] !== null
      ) {
        result = this.controllers[controllersName];
        return result;
      }else{
        throw new Error('[Controllers] Index -> getControllers | Not: ' + controllersName + ' Controllers');
      }
    } catch (error) {
      return error;
    }
  };

  return Controllers;
})();

module.exports = new Controllers();