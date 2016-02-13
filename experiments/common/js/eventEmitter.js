var EventEmitter = (function() {

  var slice = [].slice;

  function EventEmitter() {}

  EventEmitter.prototype.on = function(event, callback) {
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

  EventEmitter.prototype.once = function(event, callback) {
    this.on(event, function() {
      this.off(event, arguments.callee);
      return callback.apply(this, arguments);
    });
    return this;
  };

  EventEmitter.prototype.trigger = function() {
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

  EventEmitter.prototype.off = function(event, callback) {
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

  return EventEmitter;
})();