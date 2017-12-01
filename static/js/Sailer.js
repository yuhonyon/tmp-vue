(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function (win) {
  var doc = win.document;
  var ua = win.navigator.userAgent;
  var isIOS = (/iPhone|iPad|iPod/i).test(ua);
  var isAndroid = (/Android/i).test(ua);
  var isWechat = (/MicroMessenger/i).test(ua);
  var iosVer = parseFloat(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) || 0;
  var callId = 0;
  
  var downloadTimeout, reloadTimeout;

  var hiddenProperty = 'hidden' in document ? 'hidden' : 
                        'webkitHidden' in document ? 'webkitHidden' : null;
  var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
  function onVisibilityChange() { // 监听页面visibilitychange事件
    if(document[hiddenProperty]) { // 当document.hidden为true时，说明页面不可见，清除timeout，不做download和reload
      downloadTimeout && clearTimeout(downloadTimeout);
      reloadTimeout && clearTimeout(reloadTimeout);
    }
  }
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);

  var _userInfo = {
    'uid': -1000,
    'uuid': '',
    //0 线上，1是qa, 3是预发
    'envType': 1,
    'sn': '',
    'appver': '',
    'token': '',
    'activity': '',
    'inApp': false,
    'offline': false
  };
  var _version = "";
  var actionList = [
    'open', //打开一个新的webview
    'redirect',//重定向
    'callNativeBack',
    'closeBrowser', //关闭当前的webView
    'wxpay', //微信支付
    'wx_pub', //微信公众账号支付
    'yinLianPay', //银联支付
    'upacp_wap', //银联网页支付
    'aliPay',//支付宝支付,
    'alipay_wap', //支付宝网页支付
    'callLogin', //唤起native登陆
    'callLogout', //唤起native登出
    'openShare',
    'copyWord',
    'asyncGetUserInfo',
    'openopenCamera',
    'showNavBar',
    'hideNavBar',
    'showTabBar',
    'hideTabBar',
    'callTangBiGift',
    'scanCode',
    'callDoctorConsult',
    'configNavBar',
    'getNativeData',
    'setNativeData',
    'getNetworkStatus',
    'startBleTransForm',
    'stopBleTransForm',
    'startBleSearch',
    'stopBleSearch',
    'selectBleScan',
    'setOrientation',
    'notifyCheckHost',
    'setActCode', // set活动页code给native
    'sendHealthPrescriptionPack'
  ];
  var nope = function () {};
  var callbackMap = {}; 
  
  var sailer_biz = {
    wxPubPay: function(param, callId) {
      sailer_public.onSuccess(callId, JSON.stringify(param));
    }
  };
  
  var sailer_private = {
    getCallId: function () {
      return 'callId' +  Math.floor(Math.random() * 10000) + '' + callId++;
    },
    callIos: function (methodUrl) {
      var iframe = document.createElement("IFRAME");
      iframe.setAttribute("src", methodUrl);
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      setTimeout(function () {
        iframe.parentNode.removeChild(iframe);
        iframe = null;
      }, 3000);
    },
    callAndroid: function (methodUrl) {
      try {
        window.NativeInterface.jsCallAndroidMethod(methodUrl);
      } catch (e) {
        console.error('【Sailer】' + e.name + ':' + e.message);
      }
    },
    stringifyData: function (obj) {
      if (obj && typeof obj === 'object') {
        return JSON.stringify(obj);
      } else {
        return obj || '';
      }
    },
    logMethodUrl: function (methodUrl) {
      var param = '';
      methodUrlArray = methodUrl.split('$');
      param = methodUrlArray.splice(3).join('$');
      methodUrlArray[0] = '<span style="color:lightblue">' + methodUrlArray[0] + '</span>';
      methodUrlArray[2] = '<span style="color:yellow">' + methodUrlArray[2] + '</span>';
      methodUrlArray[3] = '<span style="color:lightgreen">' + param + '</span>';

      sailer_public.$console.innerHTML = methodUrlArray.join('$');
      console.log(methodUrl);

    },
    callAppMethod: function (action, param, callId) {
      var param = this.stringifyData(param);
      var methodUrl="native-call:" + callId + "$action:$"+action+"$" + param;

      sailer_public.testMode && this.logMethodUrl(methodUrl);

      if (isIOS) {
        this.callIos(methodUrl);
      }
      if (isAndroid) {
        this.callAndroid(methodUrl);
      }
    },
    clearCallMap: function (callId) {
      delete callbackMap[callId]; 
    }, 
    log: function (str) {
      sailer_public.$console.innerHTML = str;
    },
    handleCallBack: function () {
      
    },
    safeExec: function (callback, context) {
      try {
        return callback.call(context);
      } catch (e) {
        var error = '【Sailer】' + e.name + ':' + e.message;
        this.log(error);
        console.info(error);
      }
    },
    parseData: function (data) {
      var jsonData = '';
      try {
        if (data) {
          jsonData = JSON.parse(data);
        }
        return jsonData;
      } catch (e) {
        var error = '【Sailer】' + e.name + ':' + e.message;
        this.log(error);
        console.info(error);

        return data; 
      }
    },
    simpleExtend: function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    checkUpgrade: function(cv, tv) {
      cv = cv ? cv : '';
      tv = tv ? tv : '';
      var cvArr = cv.split('.');
      var tvArr = tv.split('.');
      var cvLen = cvArr.length;
      var tvLen = tvArr.length;

      var loopLen = Math.min(cvLen, tvLen);
      for(var i=0; i<loopLen; i++) {
        if(cvArr[i]>tvArr[i]) {
          return true;
        }else if(cvArr[i]<tvArr[i]){
          return false;
        }
      }
      if(cvLen>=tvLen) {
        return true;
      }else{
        return false;
      }
    },
    handleUrl: function (url) {
      var reg = /(http[s]?:\/\/)|(native:\/\/)|(hybird:\/\/)/;
      var pathName = location.pathname;
      var pathArr = pathName.split('/');
      pathArr.pop();
      pathName = pathArr.join('/');
      var absUrl = location.protocol + '//' + location.host + pathName + '/' + url;
      return reg.test(url) ? url: absUrl;
    }
  }
  //
  var sailer_public = {
    isIOS: isIOS,
    isAndroid: isAndroid,
    isWechat: isWechat,
    iosVer: iosVer,
    testMode: false,
    testCallBack: false,
    callbackMap: callbackMap,
    $console: document.createElement('div'),
    setTestMode: function (mode) {
      if (mode === true) {
        var $console = document.createElement('div');
        $console.id = 'Sailer_console';
        var style = {
          background: 'rgba(0, 0, 0, 0.4)',
          color: '#FFF',
          position: 'fixed',
          bottom: '0px',
          left: '0px',
          right: '0px',
          fontSize: '16px',
          lineHeight: '1.5',
          minHeight: '40px',
          margin: '0px',
          wordBreak: 'break-all',
          padding: '0px 10px',
          zIndex: '99999999999'
        }
        for (var key in style) {
          $console.style[key] = style[key];
        }
        setTimeout(function () {
          document.body.appendChild($console);
        }, 1000);
        this.$console = $console;
        this.testMode = true;
      } else {
        this.$console.remove();
        this.$console = null;
        this.testMode = false;
      }
      return this;
    },
    nativeCall: function (action, param, successCall, failCall) {
      successCall = successCall || nope;
      failCall = failCall || nope; 
      param = param === undefined ? '' : param;

      if(arguments.length === 2) {
        //仅有action和successCall的情况
        if (param.constructor === Function) {
         successCall = param; 
         param = '';
        }
      }
      
      var callId = sailer_private.getCallId();
      var callBack = {
        success: successCall,
        fail: failCall
      };
      callbackMap[callId] = callBack;
      if(isWechat) {
        if(action == 'wx_pub') {
          sailer_biz.wxPubPay(param, callId);
        }
      }else{
        sailer_private.callAppMethod(action, param, callId);  
      }
      if (this.testCallBack) {
        var self = this;
        setTimeout(function () {
          var testData = {
            returnCode: '0000',
            returnMsg: '成功执行',
            data: {
              testData: 'success'
            }
          };
          self.onSuccess(callId, JSON.stringify(testData));
        }, 1000);
      }
    },
    onSuccess: function (callId, data) {
      data = sailer_private.parseData(data);
      sailer_private.safeExec(function () {
        callbackMap[callId].success(data, callId);
        sailer_private.clearCallMap(callId);
      });
    },
    onFail: function (callId, data) {
      data = sailer_private.parseData(data);
      sailer_private.safeExec(function () {
        callbackMap[callId].fail(data, callId);
        sailer_private.clearCallMap(callId);
      });
    },
    fire: function (eventName, data) {
      data = sailer_private.parseData(data);
      sailer_private.safeExec(function () {
        var callbacks = callbackMap[eventName];
        //DO NOT support off event during fire
        for (var i = 0; i < callbacks.length; i++) {
          callbacks[i].call(this, data);
        }
      }, this);
    },
    on: function (eventName, callback) {
      callbackMap[eventName] = callbackMap[eventName] || [];
      callbackMap[eventName].push(callback);
    },
    off: function (eventName, callback) {
      if (arguments.length === 1) {
        sailer_private.clearCallMap(eventName);
      } else {
        var callbacks = callbackMap[eventName];
        return callbacks.splice(callbacks.indexOf(callback), 1);
      }
    },
    ready: function (callback) {
      this.on('ready', callback);
    },
    getUserInfo: function () {
      return _userInfo;
    },
    compareVersion: function() {
      var args = Array.prototype.slice.call(arguments);
      if(args.length === 1) {
        return sailer_private.checkUpgrade(this.getVersion(), args[0]);
      }else if(args.length === 2) {
        return sailer_private.checkUpgrade(args[0], args[1]);
      }else{
        var error = '【Sailer】' + 'compareVersion: Params not match!';
        sailer_private.log(error);
      }
    },
    getVersion: function() {
      if(_userInfo && _userInfo.appver){
        _version = _userInfo.appver;
      }
      return _version;
    },
    updateUserInfo: function (userInfo) {
        sailer_private.simpleExtend(_userInfo, userInfo);
    },
    log: sailer_private.log
  }

  var invokeApp = {
    invokeApp: function (type, action, params) {
      var args = Array.prototype.slice.call(arguments, 1);
      var params, action;
      if (args.length === 0) {
        params = '';         
        action = 'open';
      } else if (args.length === 1) {
        params = sailer_private.stringifyData(action);
        action = 'open';
      } else {
        params = sailer_private.stringifyData(params); 
      }
      console.log(this._construtInvokeString(type, action, params));
      this._invoke(type, this._construtInvokeString(type, action, params));
    },
    downloadApp: function (type) {
      if(type == 1) {
        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=cn.dreamplus.wentang';
      }else if(type == 2) {
        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=cn.dreamplus.wentangdoctor';
      }
    },
    _invoke: function (type, universalUrl) {
      //外部链接call android时，使用sailer_private callios的iframe方案，具体见http://www.cnblogs.com/shadajin/p/5724117.html
      var self = this;
      if (isIOS && iosVer < 9) {
        //works for ios 9 and below
        location.href = universalUrl;
        downloadTimeout = setTimeout(function () {
          self.downloadApp(type);
        }, 3000); // 设置成3s是因为app唤醒有一定时间，过短就来不及触发visibilitychange，导致当从app回来后，还会走timeout中的逻辑
        reloadTimeout = setTimeout(function () {
          location.reload();
        }, 3300);
      } else if (isIOS && iosVer >= 9) {
        location.href = universalUrl; 
      } else if (isAndroid) {
        var clickTime = +new Date();
        sailer_private.callIos(universalUrl);
        setTimeout(function () {
          var t = +new Date();
          if (t - clickTime < 1100) {
            self.downloadApp(type);
          }
        },1000)
      }
    },
    _construtInvokeString: function (type, action, paramString) {
      var schema = {};
      //病人端
      if (type == 1) {
        if (isIOS && iosVer >= 9) {
          schema = {
            0: 'https://deeplink.91jkys.com/zsty/',
            1: 'https://deeplink.91jkys.com/zstytest/',
            3: 'https://deeplink.91jkys.com/zstypre/',
          }
        } else {
          schema = {
            0: 'zsty://',
            1: 'zstytest://',
            3: 'zstypre://'
          }
        }
      //医生端
      } else if(type == 2) {
        schema = {
          0: 'tygzz://',
          1: 'tygzzqa://',
          3: 'tygzzpre://'
        }
      }
      //协议头不能直接encode
      return schema[_userInfo.envType] + encodeURIComponent('$action:$' + action + '$' + paramString);
    }
  };

  //build action function 
  actionList.forEach(function (action) {
    sailer_public[action] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(action);
      if(action === 'open' || action === 'redirect') {
        args[1] = sailer_private.handleUrl(args[1]);
      }
      sailer_public.nativeCall.apply(sailer_public, args);
    }; 
  });
  sailer_private.simpleExtend(sailer_public, invokeApp);
  sailer_public.on('setUserInfo', function (data) {
    _userInfo = data;
    _userInfo.inApp = (_userInfo.inApp === 'true' ? true : false);
  });
  win.Sailer = sailer_public; 
})(window)

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxHaXRcXHNhaWxlclxcbm9kZV9tb2R1bGVzXFxncnVudC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkM6L0dpdC9zYWlsZXIvc3JjL1NhaWxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbiAod2luKSB7XG4gIHZhciBkb2MgPSB3aW4uZG9jdW1lbnQ7XG4gIHZhciB1YSA9IHdpbi5uYXZpZ2F0b3IudXNlckFnZW50O1xuICB2YXIgaXNJT1MgPSAoL2lQaG9uZXxpUGFkfGlQb2QvaSkudGVzdCh1YSk7XG4gIHZhciBpc0FuZHJvaWQgPSAoL0FuZHJvaWQvaSkudGVzdCh1YSk7XG4gIHZhciBpc1dlY2hhdCA9ICgvTWljcm9NZXNzZW5nZXIvaSkudGVzdCh1YSk7XG4gIHZhciBpb3NWZXIgPSBwYXJzZUZsb2F0KCgnJyArICgvQ1BVLipPUyAoWzAtOV9dezEsNX0pfChDUFUgbGlrZSkuKkFwcGxlV2ViS2l0LipNb2JpbGUvaS5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFswLCcnXSlbMV0pLnJlcGxhY2UoJ3VuZGVmaW5lZCcsICczXzInKS5yZXBsYWNlKCdfJywgJy4nKS5yZXBsYWNlKCdfJywgJycpKSB8fCAwO1xuICB2YXIgY2FsbElkID0gMDtcbiAgXG4gIHZhciBkb3dubG9hZFRpbWVvdXQsIHJlbG9hZFRpbWVvdXQ7XG5cbiAgdmFyIGhpZGRlblByb3BlcnR5ID0gJ2hpZGRlbicgaW4gZG9jdW1lbnQgPyAnaGlkZGVuJyA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYmtpdEhpZGRlbicgaW4gZG9jdW1lbnQgPyAnd2Via2l0SGlkZGVuJyA6IG51bGw7XG4gIHZhciB2aXNpYmlsaXR5Q2hhbmdlRXZlbnQgPSBoaWRkZW5Qcm9wZXJ0eS5yZXBsYWNlKC9oaWRkZW4vaSwgJ3Zpc2liaWxpdHljaGFuZ2UnKTtcbiAgZnVuY3Rpb24gb25WaXNpYmlsaXR5Q2hhbmdlKCkgeyAvLyDnm5HlkKzpobXpnaJ2aXNpYmlsaXR5Y2hhbmdl5LqL5Lu2XG4gICAgaWYoZG9jdW1lbnRbaGlkZGVuUHJvcGVydHldKSB7IC8vIOW9k2RvY3VtZW50LmhpZGRlbuS4unRydWXml7bvvIzor7TmmI7pobXpnaLkuI3lj6/op4HvvIzmuIXpmaR0aW1lb3V077yM5LiN5YGaZG93bmxvYWTlkoxyZWxvYWRcbiAgICAgIGRvd25sb2FkVGltZW91dCAmJiBjbGVhclRpbWVvdXQoZG93bmxvYWRUaW1lb3V0KTtcbiAgICAgIHJlbG9hZFRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHJlbG9hZFRpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2VFdmVudCwgb25WaXNpYmlsaXR5Q2hhbmdlKTtcblxuICB2YXIgX3VzZXJJbmZvID0ge1xuICAgICd1aWQnOiAtMTAwMCxcbiAgICAndXVpZCc6ICcnLFxuICAgIC8vMCDnur/kuIrvvIwx5pivcWEsIDPmmK/pooTlj5FcbiAgICAnZW52VHlwZSc6IDEsXG4gICAgJ3NuJzogJycsXG4gICAgJ2FwcHZlcic6ICcnLFxuICAgICd0b2tlbic6ICcnLFxuICAgICdhY3Rpdml0eSc6ICcnLFxuICAgICdpbkFwcCc6IGZhbHNlLFxuICAgICdvZmZsaW5lJzogZmFsc2VcbiAgfTtcbiAgdmFyIF92ZXJzaW9uID0gXCJcIjtcbiAgdmFyIGFjdGlvbkxpc3QgPSBbXG4gICAgJ29wZW4nLCAvL+aJk+W8gOS4gOS4quaWsOeahHdlYnZpZXdcbiAgICAncmVkaXJlY3QnLC8v6YeN5a6a5ZCRXG4gICAgJ2NhbGxOYXRpdmVCYWNrJyxcbiAgICAnY2xvc2VCcm93c2VyJywgLy/lhbPpl63lvZPliY3nmoR3ZWJWaWV3XG4gICAgJ3d4cGF5JywgLy/lvq7kv6HmlK/ku5hcbiAgICAnd3hfcHViJywgLy/lvq7kv6HlhazkvJfotKblj7fmlK/ku5hcbiAgICAneWluTGlhblBheScsIC8v6ZO26IGU5pSv5LuYXG4gICAgJ3VwYWNwX3dhcCcsIC8v6ZO26IGU572R6aG15pSv5LuYXG4gICAgJ2FsaVBheScsLy/mlK/ku5jlrp3mlK/ku5gsXG4gICAgJ2FsaXBheV93YXAnLCAvL+aUr+S7mOWunee9kemhteaUr+S7mFxuICAgICdjYWxsTG9naW4nLCAvL+WUpOi1t25hdGl2ZeeZu+mZhlxuICAgICdjYWxsTG9nb3V0JywgLy/llKTotbduYXRpdmXnmbvlh7pcbiAgICAnb3BlblNoYXJlJyxcbiAgICAnY29weVdvcmQnLFxuICAgICdhc3luY0dldFVzZXJJbmZvJyxcbiAgICAnb3Blbm9wZW5DYW1lcmEnLFxuICAgICdzaG93TmF2QmFyJyxcbiAgICAnaGlkZU5hdkJhcicsXG4gICAgJ3Nob3dUYWJCYXInLFxuICAgICdoaWRlVGFiQmFyJyxcbiAgICAnY2FsbFRhbmdCaUdpZnQnLFxuICAgICdzY2FuQ29kZScsXG4gICAgJ2NhbGxEb2N0b3JDb25zdWx0JyxcbiAgICAnY29uZmlnTmF2QmFyJyxcbiAgICAnZ2V0TmF0aXZlRGF0YScsXG4gICAgJ3NldE5hdGl2ZURhdGEnLFxuICAgICdnZXROZXR3b3JrU3RhdHVzJyxcbiAgICAnc3RhcnRCbGVUcmFuc0Zvcm0nLFxuICAgICdzdG9wQmxlVHJhbnNGb3JtJyxcbiAgICAnc3RhcnRCbGVTZWFyY2gnLFxuICAgICdzdG9wQmxlU2VhcmNoJyxcbiAgICAnc2VsZWN0QmxlU2NhbicsXG4gICAgJ3NldE9yaWVudGF0aW9uJyxcbiAgICAnbm90aWZ5Q2hlY2tIb3N0JyxcbiAgICAnc2V0QWN0Q29kZScsIC8vIHNldOa0u+WKqOmhtWNvZGXnu5luYXRpdmVcbiAgICAnc2VuZEhlYWx0aFByZXNjcmlwdGlvblBhY2snXG4gIF07XG4gIHZhciBub3BlID0gZnVuY3Rpb24gKCkge307XG4gIHZhciBjYWxsYmFja01hcCA9IHt9OyBcbiAgXG4gIHZhciBzYWlsZXJfYml6ID0ge1xuICAgIHd4UHViUGF5OiBmdW5jdGlvbihwYXJhbSwgY2FsbElkKSB7XG4gICAgICBzYWlsZXJfcHVibGljLm9uU3VjY2VzcyhjYWxsSWQsIEpTT04uc3RyaW5naWZ5KHBhcmFtKSk7XG4gICAgfVxuICB9O1xuICBcbiAgdmFyIHNhaWxlcl9wcml2YXRlID0ge1xuICAgIGdldENhbGxJZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdjYWxsSWQnICsgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArICcnICsgY2FsbElkKys7XG4gICAgfSxcbiAgICBjYWxsSW9zOiBmdW5jdGlvbiAobWV0aG9kVXJsKSB7XG4gICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIklGUkFNRVwiKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgbWV0aG9kVXJsKTtcbiAgICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgICB9LCAzMDAwKTtcbiAgICB9LFxuICAgIGNhbGxBbmRyb2lkOiBmdW5jdGlvbiAobWV0aG9kVXJsKSB7XG4gICAgICB0cnkge1xuICAgICAgICB3aW5kb3cuTmF0aXZlSW50ZXJmYWNlLmpzQ2FsbEFuZHJvaWRNZXRob2QobWV0aG9kVXJsKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcign44CQU2FpbGVy44CRJyArIGUubmFtZSArICc6JyArIGUubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzdHJpbmdpZnlEYXRhOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICBpZiAob2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9iaiB8fCAnJztcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvZ01ldGhvZFVybDogZnVuY3Rpb24gKG1ldGhvZFVybCkge1xuICAgICAgdmFyIHBhcmFtID0gJyc7XG4gICAgICBtZXRob2RVcmxBcnJheSA9IG1ldGhvZFVybC5zcGxpdCgnJCcpO1xuICAgICAgcGFyYW0gPSBtZXRob2RVcmxBcnJheS5zcGxpY2UoMykuam9pbignJCcpO1xuICAgICAgbWV0aG9kVXJsQXJyYXlbMF0gPSAnPHNwYW4gc3R5bGU9XCJjb2xvcjpsaWdodGJsdWVcIj4nICsgbWV0aG9kVXJsQXJyYXlbMF0gKyAnPC9zcGFuPic7XG4gICAgICBtZXRob2RVcmxBcnJheVsyXSA9ICc8c3BhbiBzdHlsZT1cImNvbG9yOnllbGxvd1wiPicgKyBtZXRob2RVcmxBcnJheVsyXSArICc8L3NwYW4+JztcbiAgICAgIG1ldGhvZFVybEFycmF5WzNdID0gJzxzcGFuIHN0eWxlPVwiY29sb3I6bGlnaHRncmVlblwiPicgKyBwYXJhbSArICc8L3NwYW4+JztcblxuICAgICAgc2FpbGVyX3B1YmxpYy4kY29uc29sZS5pbm5lckhUTUwgPSBtZXRob2RVcmxBcnJheS5qb2luKCckJyk7XG4gICAgICBjb25zb2xlLmxvZyhtZXRob2RVcmwpO1xuXG4gICAgfSxcbiAgICBjYWxsQXBwTWV0aG9kOiBmdW5jdGlvbiAoYWN0aW9uLCBwYXJhbSwgY2FsbElkKSB7XG4gICAgICB2YXIgcGFyYW0gPSB0aGlzLnN0cmluZ2lmeURhdGEocGFyYW0pO1xuICAgICAgdmFyIG1ldGhvZFVybD1cIm5hdGl2ZS1jYWxsOlwiICsgY2FsbElkICsgXCIkYWN0aW9uOiRcIithY3Rpb24rXCIkXCIgKyBwYXJhbTtcblxuICAgICAgc2FpbGVyX3B1YmxpYy50ZXN0TW9kZSAmJiB0aGlzLmxvZ01ldGhvZFVybChtZXRob2RVcmwpO1xuXG4gICAgICBpZiAoaXNJT1MpIHtcbiAgICAgICAgdGhpcy5jYWxsSW9zKG1ldGhvZFVybCk7XG4gICAgICB9XG4gICAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgIHRoaXMuY2FsbEFuZHJvaWQobWV0aG9kVXJsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyQ2FsbE1hcDogZnVuY3Rpb24gKGNhbGxJZCkge1xuICAgICAgZGVsZXRlIGNhbGxiYWNrTWFwW2NhbGxJZF07IFxuICAgIH0sIFxuICAgIGxvZzogZnVuY3Rpb24gKHN0cikge1xuICAgICAgc2FpbGVyX3B1YmxpYy4kY29uc29sZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgfSxcbiAgICBoYW5kbGVDYWxsQmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgXG4gICAgfSxcbiAgICBzYWZlRXhlYzogZnVuY3Rpb24gKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdmFyIGVycm9yID0gJ+OAkFNhaWxlcuOAkScgKyBlLm5hbWUgKyAnOicgKyBlLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubG9nKGVycm9yKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcnNlRGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBqc29uRGF0YSA9ICcnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBqc29uRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpzb25EYXRhO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB2YXIgZXJyb3IgPSAn44CQU2FpbGVy44CRJyArIGUubmFtZSArICc6JyArIGUubWVzc2FnZTtcbiAgICAgICAgdGhpcy5sb2coZXJyb3IpO1xuICAgICAgICBjb25zb2xlLmluZm8oZXJyb3IpO1xuXG4gICAgICAgIHJldHVybiBkYXRhOyBcbiAgICAgIH1cbiAgICB9LFxuICAgIHNpbXBsZUV4dGVuZDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9LFxuICAgIGNoZWNrVXBncmFkZTogZnVuY3Rpb24oY3YsIHR2KSB7XG4gICAgICBjdiA9IGN2ID8gY3YgOiAnJztcbiAgICAgIHR2ID0gdHYgPyB0diA6ICcnO1xuICAgICAgdmFyIGN2QXJyID0gY3Yuc3BsaXQoJy4nKTtcbiAgICAgIHZhciB0dkFyciA9IHR2LnNwbGl0KCcuJyk7XG4gICAgICB2YXIgY3ZMZW4gPSBjdkFyci5sZW5ndGg7XG4gICAgICB2YXIgdHZMZW4gPSB0dkFyci5sZW5ndGg7XG5cbiAgICAgIHZhciBsb29wTGVuID0gTWF0aC5taW4oY3ZMZW4sIHR2TGVuKTtcbiAgICAgIGZvcih2YXIgaT0wOyBpPGxvb3BMZW47IGkrKykge1xuICAgICAgICBpZihjdkFycltpXT50dkFycltpXSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ZWxzZSBpZihjdkFycltpXTx0dkFycltpXSl7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZihjdkxlbj49dHZMZW4pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlVXJsOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICB2YXIgcmVnID0gLyhodHRwW3NdPzpcXC9cXC8pfChuYXRpdmU6XFwvXFwvKXwoaHliaXJkOlxcL1xcLykvO1xuICAgICAgdmFyIHBhdGhOYW1lID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICB2YXIgcGF0aEFyciA9IHBhdGhOYW1lLnNwbGl0KCcvJyk7XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgcGF0aE5hbWUgPSBwYXRoQXJyLmpvaW4oJy8nKTtcbiAgICAgIHZhciBhYnNVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgcGF0aE5hbWUgKyAnLycgKyB1cmw7XG4gICAgICByZXR1cm4gcmVnLnRlc3QodXJsKSA/IHVybDogYWJzVXJsO1xuICAgIH1cbiAgfVxuICAvL1xuICB2YXIgc2FpbGVyX3B1YmxpYyA9IHtcbiAgICBpc0lPUzogaXNJT1MsXG4gICAgaXNBbmRyb2lkOiBpc0FuZHJvaWQsXG4gICAgaXNXZWNoYXQ6IGlzV2VjaGF0LFxuICAgIGlvc1ZlcjogaW9zVmVyLFxuICAgIHRlc3RNb2RlOiBmYWxzZSxcbiAgICB0ZXN0Q2FsbEJhY2s6IGZhbHNlLFxuICAgIGNhbGxiYWNrTWFwOiBjYWxsYmFja01hcCxcbiAgICAkY29uc29sZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgc2V0VGVzdE1vZGU6IGZ1bmN0aW9uIChtb2RlKSB7XG4gICAgICBpZiAobW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICB2YXIgJGNvbnNvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgJGNvbnNvbGUuaWQgPSAnU2FpbGVyX2NvbnNvbGUnO1xuICAgICAgICB2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMC40KScsXG4gICAgICAgICAgY29sb3I6ICcjRkZGJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBib3R0b206ICcwcHgnLFxuICAgICAgICAgIGxlZnQ6ICcwcHgnLFxuICAgICAgICAgIHJpZ2h0OiAnMHB4JyxcbiAgICAgICAgICBmb250U2l6ZTogJzE2cHgnLFxuICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxLjUnLFxuICAgICAgICAgIG1pbkhlaWdodDogJzQwcHgnLFxuICAgICAgICAgIG1hcmdpbjogJzBweCcsXG4gICAgICAgICAgd29yZEJyZWFrOiAnYnJlYWstYWxsJyxcbiAgICAgICAgICBwYWRkaW5nOiAnMHB4IDEwcHgnLFxuICAgICAgICAgIHpJbmRleDogJzk5OTk5OTk5OTk5J1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgICAgICAgICRjb25zb2xlLnN0eWxlW2tleV0gPSBzdHlsZVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoJGNvbnNvbGUpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgdGhpcy4kY29uc29sZSA9ICRjb25zb2xlO1xuICAgICAgICB0aGlzLnRlc3RNb2RlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGNvbnNvbGUucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuJGNvbnNvbGUgPSBudWxsO1xuICAgICAgICB0aGlzLnRlc3RNb2RlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG5hdGl2ZUNhbGw6IGZ1bmN0aW9uIChhY3Rpb24sIHBhcmFtLCBzdWNjZXNzQ2FsbCwgZmFpbENhbGwpIHtcbiAgICAgIHN1Y2Nlc3NDYWxsID0gc3VjY2Vzc0NhbGwgfHwgbm9wZTtcbiAgICAgIGZhaWxDYWxsID0gZmFpbENhbGwgfHwgbm9wZTsgXG4gICAgICBwYXJhbSA9IHBhcmFtID09PSB1bmRlZmluZWQgPyAnJyA6IHBhcmFtO1xuXG4gICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIC8v5LuF5pyJYWN0aW9u5ZKMc3VjY2Vzc0NhbGznmoTmg4XlhrVcbiAgICAgICAgaWYgKHBhcmFtLmNvbnN0cnVjdG9yID09PSBGdW5jdGlvbikge1xuICAgICAgICAgc3VjY2Vzc0NhbGwgPSBwYXJhbTsgXG4gICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBjYWxsSWQgPSBzYWlsZXJfcHJpdmF0ZS5nZXRDYWxsSWQoKTtcbiAgICAgIHZhciBjYWxsQmFjayA9IHtcbiAgICAgICAgc3VjY2Vzczogc3VjY2Vzc0NhbGwsXG4gICAgICAgIGZhaWw6IGZhaWxDYWxsXG4gICAgICB9O1xuICAgICAgY2FsbGJhY2tNYXBbY2FsbElkXSA9IGNhbGxCYWNrO1xuICAgICAgaWYoaXNXZWNoYXQpIHtcbiAgICAgICAgaWYoYWN0aW9uID09ICd3eF9wdWInKSB7XG4gICAgICAgICAgc2FpbGVyX2Jpei53eFB1YlBheShwYXJhbSwgY2FsbElkKTtcbiAgICAgICAgfVxuICAgICAgfWVsc2V7XG4gICAgICAgIHNhaWxlcl9wcml2YXRlLmNhbGxBcHBNZXRob2QoYWN0aW9uLCBwYXJhbSwgY2FsbElkKTsgIFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMudGVzdENhbGxCYWNrKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHRlc3REYXRhID0ge1xuICAgICAgICAgICAgcmV0dXJuQ29kZTogJzAwMDAnLFxuICAgICAgICAgICAgcmV0dXJuTXNnOiAn5oiQ5Yqf5omn6KGMJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGVzdERhdGE6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgc2VsZi5vblN1Y2Nlc3MoY2FsbElkLCBKU09OLnN0cmluZ2lmeSh0ZXN0RGF0YSkpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKGNhbGxJZCwgZGF0YSkge1xuICAgICAgZGF0YSA9IHNhaWxlcl9wcml2YXRlLnBhcnNlRGF0YShkYXRhKTtcbiAgICAgIHNhaWxlcl9wcml2YXRlLnNhZmVFeGVjKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGJhY2tNYXBbY2FsbElkXS5zdWNjZXNzKGRhdGEsIGNhbGxJZCk7XG4gICAgICAgIHNhaWxlcl9wcml2YXRlLmNsZWFyQ2FsbE1hcChjYWxsSWQpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkZhaWw6IGZ1bmN0aW9uIChjYWxsSWQsIGRhdGEpIHtcbiAgICAgIGRhdGEgPSBzYWlsZXJfcHJpdmF0ZS5wYXJzZURhdGEoZGF0YSk7XG4gICAgICBzYWlsZXJfcHJpdmF0ZS5zYWZlRXhlYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbGxiYWNrTWFwW2NhbGxJZF0uZmFpbChkYXRhLCBjYWxsSWQpO1xuICAgICAgICBzYWlsZXJfcHJpdmF0ZS5jbGVhckNhbGxNYXAoY2FsbElkKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZmlyZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgZGF0YSA9IHNhaWxlcl9wcml2YXRlLnBhcnNlRGF0YShkYXRhKTtcbiAgICAgIHNhaWxlcl9wcml2YXRlLnNhZmVFeGVjKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IGNhbGxiYWNrTWFwW2V2ZW50TmFtZV07XG4gICAgICAgIC8vRE8gTk9UIHN1cHBvcnQgb2ZmIGV2ZW50IGR1cmluZyBmaXJlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFja01hcFtldmVudE5hbWVdID0gY2FsbGJhY2tNYXBbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgIGNhbGxiYWNrTWFwW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBzYWlsZXJfcHJpdmF0ZS5jbGVhckNhbGxNYXAoZXZlbnROYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBjYWxsYmFja01hcFtldmVudE5hbWVdO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2tzLnNwbGljZShjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayksIDEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVhZHk6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncmVhZHknLCBjYWxsYmFjayk7XG4gICAgfSxcbiAgICBnZXRVc2VySW5mbzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF91c2VySW5mbztcbiAgICB9LFxuICAgIGNvbXBhcmVWZXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGlmKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBzYWlsZXJfcHJpdmF0ZS5jaGVja1VwZ3JhZGUodGhpcy5nZXRWZXJzaW9uKCksIGFyZ3NbMF0pO1xuICAgICAgfWVsc2UgaWYoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHNhaWxlcl9wcml2YXRlLmNoZWNrVXBncmFkZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgZXJyb3IgPSAn44CQU2FpbGVy44CRJyArICdjb21wYXJlVmVyc2lvbjogUGFyYW1zIG5vdCBtYXRjaCEnO1xuICAgICAgICBzYWlsZXJfcHJpdmF0ZS5sb2coZXJyb3IpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VmVyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZihfdXNlckluZm8gJiYgX3VzZXJJbmZvLmFwcHZlcil7XG4gICAgICAgIF92ZXJzaW9uID0gX3VzZXJJbmZvLmFwcHZlcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfdmVyc2lvbjtcbiAgICB9LFxuICAgIHVwZGF0ZVVzZXJJbmZvOiBmdW5jdGlvbiAodXNlckluZm8pIHtcbiAgICAgICAgc2FpbGVyX3ByaXZhdGUuc2ltcGxlRXh0ZW5kKF91c2VySW5mbywgdXNlckluZm8pO1xuICAgIH0sXG4gICAgbG9nOiBzYWlsZXJfcHJpdmF0ZS5sb2dcbiAgfVxuXG4gIHZhciBpbnZva2VBcHAgPSB7XG4gICAgaW52b2tlQXBwOiBmdW5jdGlvbiAodHlwZSwgYWN0aW9uLCBwYXJhbXMpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHZhciBwYXJhbXMsIGFjdGlvbjtcbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBwYXJhbXMgPSAnJzsgICAgICAgICBcbiAgICAgICAgYWN0aW9uID0gJ29wZW4nO1xuICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBwYXJhbXMgPSBzYWlsZXJfcHJpdmF0ZS5zdHJpbmdpZnlEYXRhKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbiA9ICdvcGVuJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcyA9IHNhaWxlcl9wcml2YXRlLnN0cmluZ2lmeURhdGEocGFyYW1zKTsgXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLl9jb25zdHJ1dEludm9rZVN0cmluZyh0eXBlLCBhY3Rpb24sIHBhcmFtcykpO1xuICAgICAgdGhpcy5faW52b2tlKHR5cGUsIHRoaXMuX2NvbnN0cnV0SW52b2tlU3RyaW5nKHR5cGUsIGFjdGlvbiwgcGFyYW1zKSk7XG4gICAgfSxcbiAgICBkb3dubG9hZEFwcDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGlmKHR5cGUgPT0gMSkge1xuICAgICAgICBsb2NhdGlvbi5ocmVmID0gJ2h0dHA6Ly9hLmFwcC5xcS5jb20vby9zaW1wbGUuanNwP3BrZ25hbWU9Y24uZHJlYW1wbHVzLndlbnRhbmcnO1xuICAgICAgfWVsc2UgaWYodHlwZSA9PSAyKSB7XG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSAnaHR0cDovL2EuYXBwLnFxLmNvbS9vL3NpbXBsZS5qc3A/cGtnbmFtZT1jbi5kcmVhbXBsdXMud2VudGFuZ2RvY3Rvcic7XG4gICAgICB9XG4gICAgfSxcbiAgICBfaW52b2tlOiBmdW5jdGlvbiAodHlwZSwgdW5pdmVyc2FsVXJsKSB7XG4gICAgICAvL+WklumDqOmTvuaOpWNhbGwgYW5kcm9pZOaXtu+8jOS9v+eUqHNhaWxlcl9wcml2YXRlIGNhbGxpb3PnmoRpZnJhbWXmlrnmoYjvvIzlhbfkvZPop4FodHRwOi8vd3d3LmNuYmxvZ3MuY29tL3NoYWRhamluL3AvNTcyNDExNy5odG1sXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoaXNJT1MgJiYgaW9zVmVyIDwgOSkge1xuICAgICAgICAvL3dvcmtzIGZvciBpb3MgOSBhbmQgYmVsb3dcbiAgICAgICAgbG9jYXRpb24uaHJlZiA9IHVuaXZlcnNhbFVybDtcbiAgICAgICAgZG93bmxvYWRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5kb3dubG9hZEFwcCh0eXBlKTtcbiAgICAgICAgfSwgMzAwMCk7IC8vIOiuvue9ruaIkDNz5piv5Zug5Li6YXBw5ZSk6YaS5pyJ5LiA5a6a5pe26Ze077yM6L+H55+t5bCx5p2l5LiN5Y+K6Kem5Y+RdmlzaWJpbGl0eWNoYW5nZe+8jOWvvOiHtOW9k+S7jmFwcOWbnuadpeWQju+8jOi/mOS8mui1sHRpbWVvdXTkuK3nmoTpgLvovpFcbiAgICAgICAgcmVsb2FkVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9LCAzMzAwKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNJT1MgJiYgaW9zVmVyID49IDkpIHtcbiAgICAgICAgbG9jYXRpb24uaHJlZiA9IHVuaXZlcnNhbFVybDsgXG4gICAgICB9IGVsc2UgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICB2YXIgY2xpY2tUaW1lID0gK25ldyBEYXRlKCk7XG4gICAgICAgIHNhaWxlcl9wcml2YXRlLmNhbGxJb3ModW5pdmVyc2FsVXJsKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHQgPSArbmV3IERhdGUoKTtcbiAgICAgICAgICBpZiAodCAtIGNsaWNrVGltZSA8IDExMDApIHtcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWRBcHAodHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LDEwMDApXG4gICAgICB9XG4gICAgfSxcbiAgICBfY29uc3RydXRJbnZva2VTdHJpbmc6IGZ1bmN0aW9uICh0eXBlLCBhY3Rpb24sIHBhcmFtU3RyaW5nKSB7XG4gICAgICB2YXIgc2NoZW1hID0ge307XG4gICAgICAvL+eXheS6uuerr1xuICAgICAgaWYgKHR5cGUgPT0gMSkge1xuICAgICAgICBpZiAoaXNJT1MgJiYgaW9zVmVyID49IDkpIHtcbiAgICAgICAgICBzY2hlbWEgPSB7XG4gICAgICAgICAgICAwOiAnaHR0cHM6Ly9kZWVwbGluay45MWpreXMuY29tL3pzdHkvJyxcbiAgICAgICAgICAgIDE6ICdodHRwczovL2RlZXBsaW5rLjkxamt5cy5jb20venN0eXRlc3QvJyxcbiAgICAgICAgICAgIDM6ICdodHRwczovL2RlZXBsaW5rLjkxamt5cy5jb20venN0eXByZS8nLFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2hlbWEgPSB7XG4gICAgICAgICAgICAwOiAnenN0eTovLycsXG4gICAgICAgICAgICAxOiAnenN0eXRlc3Q6Ly8nLFxuICAgICAgICAgICAgMzogJ3pzdHlwcmU6Ly8nXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvL+WMu+eUn+err1xuICAgICAgfSBlbHNlIGlmKHR5cGUgPT0gMikge1xuICAgICAgICBzY2hlbWEgPSB7XG4gICAgICAgICAgMDogJ3R5Z3p6Oi8vJyxcbiAgICAgICAgICAxOiAndHlnenpxYTovLycsXG4gICAgICAgICAgMzogJ3R5Z3p6cHJlOi8vJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvL+WNj+iuruWktOS4jeiDveebtOaOpWVuY29kZVxuICAgICAgcmV0dXJuIHNjaGVtYVtfdXNlckluZm8uZW52VHlwZV0gKyBlbmNvZGVVUklDb21wb25lbnQoJyRhY3Rpb246JCcgKyBhY3Rpb24gKyAnJCcgKyBwYXJhbVN0cmluZyk7XG4gICAgfVxuICB9O1xuXG4gIC8vYnVpbGQgYWN0aW9uIGZ1bmN0aW9uIFxuICBhY3Rpb25MaXN0LmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHNhaWxlcl9wdWJsaWNbYWN0aW9uXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGFyZ3MudW5zaGlmdChhY3Rpb24pO1xuICAgICAgaWYoYWN0aW9uID09PSAnb3BlbicgfHwgYWN0aW9uID09PSAncmVkaXJlY3QnKSB7XG4gICAgICAgIGFyZ3NbMV0gPSBzYWlsZXJfcHJpdmF0ZS5oYW5kbGVVcmwoYXJnc1sxXSk7XG4gICAgICB9XG4gICAgICBzYWlsZXJfcHVibGljLm5hdGl2ZUNhbGwuYXBwbHkoc2FpbGVyX3B1YmxpYywgYXJncyk7XG4gICAgfTsgXG4gIH0pO1xuICBzYWlsZXJfcHJpdmF0ZS5zaW1wbGVFeHRlbmQoc2FpbGVyX3B1YmxpYywgaW52b2tlQXBwKTtcbiAgc2FpbGVyX3B1YmxpYy5vbignc2V0VXNlckluZm8nLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIF91c2VySW5mbyA9IGRhdGE7XG4gICAgX3VzZXJJbmZvLmluQXBwID0gKF91c2VySW5mby5pbkFwcCA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlKTtcbiAgfSk7XG4gIHdpbi5TYWlsZXIgPSBzYWlsZXJfcHVibGljOyBcbn0pKHdpbmRvdylcbiJdfQ==
