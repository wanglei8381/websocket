var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Event = function () {
  function Event(ctx) {
    classCallCheck(this, Event);

    this._events = {};
    this._ctx = ctx;
  }

  /**
   * 绑定一个事件
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */


  createClass(Event, [{
    key: 'on',
    value: function on(name, cb, ctx) {
      return eventsOnApi(this, name, cb, ctx, false);
    }

    /**
     * 绑定一个事件,只执行一次
     * @param name 事件名
     * @param cb 回调函数
     * @param ctx 上下文
     * @returns {Event}
     */

  }, {
    key: 'once',
    value: function once(name, cb, ctx) {
      return eventsOnApi(this, name, cb, ctx, true);
    }

    /**
     * 卸载一个绑定的事件
     * @param name 事件名
     * @param cb 回调函数
     * @param ctx 上下文
     * @returns {Event}
     */

  }, {
    key: 'off',
    value: function off(name, cb, ctx) {
      var events = eventsApi(this, name, cb, ctx);
      for (var key in events) {
        var e = this._events[key];
        events[key].slice().forEach(function (item) {
          e.splice(e.indexOf(item), 1);
        });
      }
      return this;
    }

    /**
     * 暂停某个事件，用法同off
     * @param name
     * @param cb
     * @param ctx
     */

  }, {
    key: 'pause',
    value: function pause(name, cb, ctx) {
      return eventsPauseApi(this, name, cb, ctx, true);
    }

    /**
     * 恢复某个事件，继续触发回调，用法同off
     * @param name
     * @param cb
     * @param ctx
     */

  }, {
    key: 'resume',
    value: function resume(name, cb, ctx) {
      return eventsPauseApi(this, name, cb, ctx, false);
    }
  }, {
    key: 'emit',
    value: function emit(name) {
      var _this = this;
      if (!name || typeof name !== 'string') return this;
      var len = arguments.length;
      var args = [];
      var i = 1;
      while (i < len) {
        args.push(arguments[i++]);
      }

      name.split(/\s+/).forEach(function (ename) {
        if (ename && _this._events[ename]) {
          _this._events[ename].slice().forEach(function (handler) {
            if (handler.once) {
              handler.cb.apply(handler.ctx, args);
              _this.off(ename, handler.cb, handler.ctx);
            } else if (!handler.pause) {
              handler.cb.apply(handler.ctx, args);
            }
          });
        }
      });

      return this;
    }
  }]);
  return Event;
}();

/**
 * 找到符合规则的事件，off,pause,resume 通用方法
 * @param self Event实例
 * @param name 事件名，可以是空格隔开的多个事件名
 * @param cb 回调函数
 * @param ctx 绑定回调函数的上下文
 * @return events
 */


function eventsApi(self, name, cb, ctx) {
  var events = {};

  // name 存在时，找到所有name下的事件列表
  if (name) {
    name.split(/\s+/).forEach(function (ename) {
      if (ename && self._events[ename]) {
        events[ename] = self._events[ename];
      }
    });
  } else {
    for (var key in self._events) {
      events[key] = self._events[key];
    }
  }

  var keys = Object.keys(events);

  if (keys.length === 0) return events;

  if (cb && typeof cb === 'function') {
    keys.forEach(function (key) {
      events[key] = events[key].filter(function (e) {
        return e.cb === cb;
      });
    });
  }

  if (ctx) {
    keys.forEach(function (key) {
      events[key] = events[key].filter(function (e) {
        return e.ctx === ctx;
      });
    });
  }

  return events;
}

// 暂停,恢复通用方法
function eventsPauseApi(self, name, cb, ctx, pause) {
  var events = eventsApi(self, name, cb, ctx);
  for (var key in events) {
    events[key].forEach(function (item) {
      item.pause = pause;
    });
  }

  return self;
}

/**
 * on,once 通用方法
 * @param self Event实例
 * @param name 事件名，可以是空格隔开的多个事件名
 * @param cb 回调函数
 * @param ctx 绑定回调函数的上下文
 * @param once 是否是once
 * @return self
 */
function eventsOnApi(self, name, cb, ctx, once) {
  if (!name || typeof cb !== 'function' || typeof name !== 'string') return self;
  name.split(/\s+/).forEach(function (ename) {
    var handlers = self._events[ename] || [];
    handlers.push({
      cb: cb,
      ctx: ctx || self._ctx,
      pause: false,
      once: once
    });
    self._events[ename] = handlers;
  });
  return self;
}

var settings = {
  url: null,
  protocols: null,
  debug: false,
  // 实例化时直接创建连接，无须手动open
  automaticOpen: true,
  // 自动尝试连接
  automaticReconnect: true,
  // 每次尝试连接的事件间隔
  reconnectInterval: 1000,
  // 最大延迟连接的事件间隔
  maxReconnectInterval: 30000,
  // 重新尝试连接的比率
  reconnectDecay: 1.5,
  // 连接超时事件，毫秒值
  timeoutInterval: 2000,
  // 最大连接数
  maxReconnectAttempts: null,
  // 二进制类型，默认blob，或者arraybuffer
  binaryType: 'blob'
};

var WebSocketIO = function (_Event) {
  inherits(WebSocketIO, _Event);

  function WebSocketIO(url, protocols) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, WebSocketIO);

    var _this = possibleConstructorReturn(this, (WebSocketIO.__proto__ || Object.getPrototypeOf(WebSocketIO)).call(this));

    if (isPlainObject(protocols)) {
      options = protocols;
      protocols = null;
    }
    // 设置配置
    _this.setConfig(options);

    _this.url = url;
    // 可以是一个单个的协议名字字符串或者包含多个协议名字字符串的数组。这些字符串用来表示子协议，这样做可以让一个服务器实现多种WebSocket子协议
    _this.protocols = protocols;
    // 后端指定的子协议
    _this.protocol = null;
    // websocket的实例
    _this.io = null;
    // 手动关闭
    _this.forcedClose = false;
    // 是否被销毁
    _this.active = true;
    // 重新尝试连接的次数
    _this.reconnectAttempts = 0;
    // 数据缓存池
    _this.polls = [];

    // 自动打开连接
    if (_this.automaticOpen === true) {
      _this.open(false);
    }
    return _this;
  }

  createClass(WebSocketIO, [{
    key: 'setConfig',
    value: function setConfig(options) {
      if (!isPlainObject(options)) return;
      // 代理设置选项
      for (var key in settings) {
        if (typeof options[key] !== 'undefined') {
          this[key] = options[key];
        } else if (this[key] == null) {
          this[key] = settings[key];
        }
      }
    }
  }, {
    key: 'start',
    value: function start(options) {
      this.setConfig(options);
      this.open(false);
    }
  }, {
    key: 'open',
    value: function open(reconnectAttempt) {
      var _this2 = this;

      // 已经销毁或已经存在io实例不做处理
      if (!this.active || this.io) return;
      try {
        this.io = new WebSocket(this.url, this.protocols);
      } catch (e) {
        this.emit('error', e);
        throw e;
      }

      // 再次尝试连接
      if (reconnectAttempt) {
        if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
          return;
        }
      } else {
        this.reconnectAttempts = 0;
      }

      // 触发connecting事件，通知正在连接
      this.emit('connecting');
      log('attempt-connect', this);

      // 设置超时
      this.timeId = setTimeout(function () {
        log('connection-timeout', _this2);
        _this2.timeoutClosed = true;
        _this2.io.close();
        _this2.timeoutClosed = false;
      }, this.timeoutInterval);

      // 监听WebSocket的回调事件
      attachEvent(this, this.io, reconnectAttempt);
    }

    // 发送数据

  }, {
    key: 'send',
    value: function send(data) {
      if (this.readyState === 1) {
        log('send data: ', data, this);
        return this.io.send(data);
      } else {
        console.error('WebSocket实例不存在，请尝试重新连接');
      }
    }

    // 写数据, 会缓存数据, 返回0：直接发送，大于0：缓存，-1：无效状态

  }, {
    key: 'write',
    value: function write(type, payload) {
      if (this.readyState === 1) {
        this.send(JSON.stringify({ type: type, payload: payload }));
        return 0;
      } else if (this.active) {
        // 注意内存泄漏
        this.polls.push(JSON.stringify({ type: type, payload: payload }));
        return this.polls.length;
      }
      return -1;
    }
  }, {
    key: 'flush',
    value: function flush() {
      var polls = this.polls;
      for (var i = 0, length = polls.length; i < length; i++) {
        this.send(polls[i]);
      }
      this.polls = [];
    }
  }, {
    key: 'close',
    value: function close(reason) {
      var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

      if (!this.active) return;
      this.forcedClose = true;
      if (this.io) {
        this.io.close(code, reason);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.active) {
        this.active = false;
        this.close('destroy');
      }
    }
  }, {
    key: 'readyState',
    get: function get$$1() {
      if (this.io) {
        return this.io.readyState;
      }
    }
  }]);
  return WebSocketIO;
}(Event);

function attachEvent(ws, io, reconnectAttempt) {
  io.onopen = function (e) {
    clearTimeout(ws.timeId);
    log('open', ws);
    this.reconnectAttempts = 0;
    ws.protocol = io.protocol;
    ws.emit('open', e);
    ws.flush();
  };

  io.onclose = function (e) {
    clearTimeout(ws.timeId);
    ws.io = null;
    if (ws.forcedClose) {
      ws.emit('close', e);
      if (!ws.active) {
        // 通过destroy销毁对象，在执行完事件通知完毕后，清空事件
        ws._events = {};
      }
    } else {
      // 尝试再次拦截
      if (!reconnectAttempt && !ws.timeoutClosed) {
        ws.emit('close', e);
      }

      if (!ws.automaticReconnect) return;

      var timeout = ws.reconnectInterval * Math.pow(ws.reconnectDecay, ws.reconnectAttempts);
      setTimeout(function () {
        ws.reconnectAttempts++;
        ws.open(true);
      }, timeout > ws.maxReconnectInterval ? ws.maxReconnectInterval : timeout);
    }
  };

  io.onmessage = function (e) {
    log('onmessage: ', e.data, ws);
    ws.emit('message', e.data);
    if (typeof e.data === 'string') {
      try {
        var data = JSON.parse(e.data);
        if (data.type) {
          ws.emit(data.type, data.payload);
        }
      } catch (e) {
        log('onmessage: 解析失败，接受的数据不是json格式', ws);
      }
    }
  };

  io.onerror = function (e) {
    log('onerror: ', e, ws);
    ws.emit('error', e);
  };
}

function log() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var ws = args[args.length - 1];
  if (ws.debug) {
    var _console;

    var e = args.slice(0, args.length - 1);
    (_console = console).log.apply(_console, toConsumableArray(e));
  }
}

function isObjectLike(obj) {
  return obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

var objectProto = Object.prototype;
var toString = function toString(obj) {
  return objectProto.toString.call(obj);
};

function isPlainObject(obj) {
  if (!isObjectLike(obj) || toString(obj) !== '[object Object]') {
    return false;
  }
  var proto = Object.getPrototypeOf(obj);
  if (proto === null) {
    return true;
  }

  return proto.constructor === Object;
}

export default WebSocketIO;
