'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scriptjs = require('scriptjs');

var _scriptjs2 = _interopRequireDefault(_scriptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  init: function init() {
    var assets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    window._wpcf7 = null;
    var defaultAssets = {
      foundForm: document.querySelector('.wpcf7-form'),
      gifPath: '/wp-content/plugins/contact-form-7/images/ajax-loader.gif',
      jqueryPath: '/wp-includes/js/jquery/jquery.js',
      jqueryFormPath: '/wp-content/plugins/contact-form-7/includes/js/jquery.form.min.js',
      cf7ScriptPath: '/wp-content/plugins/contact-form-7/includes/js/scripts.js'
    };
    this.assets = typeof Object.assign !== 'undefined' ? Object.assign({}, defaultAssets, assets) : defaultAssets;
    if (!this.allAssetsFound() || this.badBrowser()) {
      return false;
    }
    this.applyLoaderGifs();
    this.boundSubmitHandler = this.submitHandler.bind(this);
    this.boundLoadFormScripts = this.loadFormScripts.bind(this);
    this.attachSubmitHandlers();
  },
  applyLoaderGifs: function applyLoaderGifs() {
    var _this = this;

    this.loaderGif = this.createLoader();
    var targets = [].slice.call(document.querySelectorAll('.wpcf7-submit'));
    targets.forEach(function (el) {
      el.insertAdjacentElement('afterend', _this.loaderGif.cloneNode(true));
    });
  },
  badBrowser: function badBrowser() {
    return !('querySelectorAll' in document && document.addEventListener);
  },
  allAssetsFound: function allAssetsFound() {
    return Object.values(this.assets).every(function (asset) {
      return assets !== null;
    });
  },
  attachSubmitHandlers: function attachSubmitHandlers() {
    var _this2 = this;

    var targets = [].slice.call(document.querySelectorAll('.wpcf7-form'));
    targets.forEach(function (form) {
      form.addEventListener('submit', _this2.boundSubmitHandler);
    });
  },
  loadFormScripts: function loadFormScripts() {
    var _this3 = this;

    (0, _scriptjs2.default)(this.assets.jqueryFormPath, 'jqFormPlugin');
    _scriptjs2.default.ready('jqFormPlugin', function () {
      (0, _scriptjs2.default)(_this3.assets.cf7ScriptPath, 'formBundle');
    });
  },
  scriptsReadyHandler: function scriptsReadyHandler(e) {
    e.target.removeEventListener(e.type, this.boundSubmitHandler, false);
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('submit', false, true);
    e.target.dispatchEvent(evt);
  },


  // runs once per CF7 form
  submitHandler: function submitHandler(e) {
    e.preventDefault();

    if (typeof window.jQuery === 'undefined') {
      (0, _scriptjs2.default)(this.assets.jqueryPath, 'jquery');
      _scriptjs2.default.ready('jquery', this.boundLoadFormScripts);
    } else {
      this.boundLoadFormScripts();
    }

    _scriptjs2.default.ready('formBundle', this.scriptsReadyHandler.bind(this, e));
  },
  createLoader: function createLoader() {
    var img = document.createElement('img');
    img.setAttribute('class', 'ajax-loader');
    img.alt = 'Sending...';
    img.style.visibility = 'hidden';
    img.src = this.assets.gifPath;
    return img;
  }
};