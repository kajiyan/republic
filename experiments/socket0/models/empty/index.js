// ============================================================
// Empty Model
var Empty = (function() {
  var config = require('config');
  var _ = require('lodash');
  var validator = require('validator');

  // --------------------------------------------------------------
  /**
   * Empty constructor
   */
  function Empty(_keyData) {
    console.log('[Model] Empty -> constructor');
    var keyData = _.extend({
      'mongoose': null
    }, _keyData);

    if (keyData.mongoose !== null) {
      this.mongoose = keyData.mongoose;
    } else {
      throw new Error('[Model] Empty -> constructor | [ReferenceError: keyData.mongoose is not defined]');
    }
  }

  // --------------------------------------------------------------
  /**
   * Empty setup
   */
  Empty.prototype.setup = function(_keyData) {
    console.log('[Model] Empty -> setup');

    var keyData = _.extend({
      'app': null
    }, _keyData);

    if (keyData.app === null) {
      throw new Error("[Model] Empty -> setup | [ReferenceError: keyData.app is not defined]");
    }
  }

  return Empty;
})();

module.exports = Empty;