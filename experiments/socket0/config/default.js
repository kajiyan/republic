var fs = require('fs');
var path = require('path');


module.exports = (function(){
  var result = {};

  result.base64 = 'data:image/png;base64,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';

  result.protocol = 'http';
  result.host = 'localhost';
  result.port = '8000';

  // result.EXTENSION_ID = "kcondcikicihkpnhhohgdngemopbdjmi";
  result.BASE_PATH = process.cwd();
  // result.AVAILABLE_PERIOD = 0.25 * 24 * 60 * 60 * 1000;
  // result.roomIdLength = 6;
  // result.roomCapacity = 6;
  // result.PUBLIC = path.join(result.BASE_PATH, 'public/');
  // result.MEMORYS_DIR_NAME = 'memorys';
  // result.MEMORYS_DIR_PATH = path.join(result.BASE_PATH, 'public/' + result.MEMORYS_DIR_NAME + '/');
  result.MODELS = path.join(result.BASE_PATH, 'models/');
  result.VIEWS = path.join(result.BASE_PATH, 'views/');
  result.CONTROLLERS = path.join(result.BASE_PATH, 'controllers/');
  result.ROUTES = path.join(result.BASE_PATH, 'routes/');
  result.HELPERS = path.join(result.BASE_PATH, 'helpers/');

  result.MONGO_DB = 'mongodb://localhost/experiments';

  result.SOCKET_NAME_SPACE = 'experiments';

  return result;
})();