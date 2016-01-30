// ============================================================
// Empty Controller
var Empty = (function() {
  var config = require('config');
  var _ = require('lodash');
  var validator = require('validator');

  // Private Method
  var _databaseConnectedHandler;
  var _setupSocket;

  // --------------------------------------------------------------
  /**
   * Empty constructor
   */
  function Empty(_keyData) {
    console.log('[Controller] Empty -> constructor');
  
    this._app = null;
    this._models = null;
    this._io = null;
    this._nameSpaceIo = null;
  }

  // --------------------------------------------------------------
  /**
   * Empty#setup
   * @param {Object} [_options]
   */
  Empty.prototype.setup = function( _keyData ) {
    console.log('[Controller] Empty -> setup');

    var keyData = _.extend({
      'app': null
    }, _keyData);

    if (keyData.app === null) {
      throw new Error('[Controller] Empty -> setup | [ReferenceError: keyData.app is not defined]');
    }

    this._app = keyData.app;
    this._models = this._app.get('models');
    // // this._models.getModel('xxx');
    this._io = this._app.get('io');
    this._nameSpaceIo = this._io.of(config.SOCKET_NAME_SPACE);

    var modelsEventEmitter = this._models.getEventEmitter();
    modelsEventEmitter.addListener('databaseConnected', _databaseConnectedHandler.bind(this));
  };

  // --------------------------------------------------------------
  /**
   * Empty#_databaseConnectedHandler
   * Models がデータベースへの接続が正常に完了したら呼び出されるイベントハンドラ 
   */
  _databaseConnectedHandler = function() {
    console.log('[Controller] Empty -> _databaseConnectedHandler');

    _setupSocket.call(this);
  };

  // --------------------------------------------------------------
  /**
   * Empty#_setupSocket
   */
  _setupSocket = function() {
    console.log('[Controller] Empty -> _setupSocket');

    this._nameSpaceIo.on('connection', function(socket) {
      console.log('[Controller] Empty -> socket connection');
    });
  }

  return Empty;
})();

module.exports = Empty;