// ============================================================
// Models Module
var Models = (function() {
  var config = require('config');
  var events = require('events');
  var mongoose = require('mongoose');
  var _ = require('lodash');

  var _connect;

  // --------------------------------------------------------------
  /**
   * Models constructor
   * @constructor
   * @classdesc モデルを管理するクラス
   */
  function Models() {
    console.log('[Models] Index -> constructor');

    this.app;
    this.eventEmitter = new events.EventEmitter;

    this.models = {
      empty: (function() {
        var Empty = require(config.MODELS + 'empty');
        return new Empty({
          'mongoose': mongoose
        });
      })()
    };
  }

  // --------------------------------------------------------------
  /**
   * Models#setup
   * データベースへの接続が完了した後、 
   * コンストラクタで登録されたモデルのセットアップを行う 
   * @return {Promise}
   */
  Models.prototype.setup = function(_options) {
    console.log('[Models] Index -> setup');

    // アプリケーションをセット
    this.app = module.parent.exports;

    var options = _.extend({
    }, _options);

    return new Promise((resolve, reject) => {
      // データベースへの接続成功したら、各モデルのセットアップを行う
      _connect.call(this).then(
        () => {
          // データベースへの接続成功したら、各モデルのセットアップを行う
          for (var modelName in this.models) {
            var model = this.models[modelName];
            model.setup({
              'app': this.app
            });
          }
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  };


  // --------------------------------------------------------------
  /**
   * Models#getModel
   * @param {string} modelName - 取得するモデルクラス名
   * @return {Object} 引数で指定したmodelNameのモデルクラスのインスタンスを返す
   */
  Models.prototype.getModel = function(modelName) {
    console.log('[Models] Index -> getModel', modelName);

    var result = {};
    try {
      if (typeof this.models[modelName] !== 'undefined' && this.models[modelName] !== null) {
        result = this.models[modelName];
        return result;
      } else {
        throw new Error('[Models] Index -> getModel | Not: ' + modelName + ' Model');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------------------
  /**
   * Models#getEventEmitter
   */
  Models.prototype.getEventEmitter = function() {
    console.log('[Models] Index -> getEventEmitter');
    return this.eventEmitter;
  };

  // --------------------------------------------------------------
  /**
   * Models#_connect
   * データベースへ接続する
   * @return {Promise}
   */
  _connect = function() {
    console.log('[Models] Index -> _connect');

    this.app = module.parent.exports;

    return new Promise((resolve, reject) => {
      // データベースへ接続
      mongoose.connect(config.MONGO_DB);
      
      this.db = mongoose.connection;

      this.db.once('open', () => {
        console.log('[Models] Index -> mongoDB connected.');
        this.eventEmitter.emit('databaseConnected');
        resolve();
      });

      this.db.on('error', function(error) {
        console.log('[Models] Index -> mongoDB connection error', error);
        reject(error);
      });
    });
  };

  return Models;
})();

module.exports = new Models();