'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createBaseForm = require('./createBaseForm');

var _createBaseForm2 = _interopRequireDefault(_createBaseForm);

var _createForm = require('./createForm');

var _utils = require('./utils');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function computedStyle(el, prop) {
  var getComputedStyle = window.getComputedStyle;
  var style =
  // If we have getComputedStyle
  getComputedStyle ?
  // Query it
  // TODO: From CSS-Query notes, we might need (node, null) for FF
  getComputedStyle(el) :

  // Otherwise, we are in IE and use currentStyle
  el.currentStyle;
  if (style) {
    return style[
    // Switch to camelCase for CSSOM
    // DEV: Grabbed from jQuery
    // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
    // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
    prop.replace(/-(\w)/gi, function (word, letter) {
      return letter.toUpperCase();
    })];
  }
  return undefined;
}

function getScrollableContainer(n) {
  var node = n;
  var nodeName = undefined;
  /* eslint no-cond-assign:0 */
  while ((nodeName = node.nodeName.toLowerCase()) !== 'body') {
    var overflowY = computedStyle(node, 'overflowY');
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
    node = node.parentNode;
  }
  return nodeName === 'body' ? node.ownerDocument : node;
}

var mixin = {
  getForm: function getForm() {
    return _extends({}, _createForm.mixin.getForm.call(this), {
      validateFieldsAndScroll: this.validateFieldsAndScroll
    });
  },
  validateFieldsAndScroll: function validateFieldsAndScroll(ns, opt, cb) {
    var _getParams = (0, _utils.getParams)(ns, opt, cb);

    var names = _getParams.names;
    var callback = _getParams.callback;
    var options = _getParams.options;


    function newCb(error, values) {
      if (error) {
        var firstNode = undefined;
        var firstTop = undefined;
        for (var name in error) {
          if (error.hasOwnProperty(name) && error[name].instance) {
            var node = _reactDom2.default.findDOMNode(error[name].instance);
            var top = node.getBoundingClientRect().top;
            if (firstTop === undefined || firstTop > top) {
              firstTop = top;
              firstNode = node;
            }
          }
        }
        if (firstNode) {
          var c = options.container || getScrollableContainer(firstNode);
          (0, _domScrollIntoView2.default)(firstNode, c, {
            onlyScrollIfNeeded: true
          });
        }
      }

      if (typeof callback === 'function') {
        callback(error, values);
      }
    }

    return this.validateFields(names, options, newCb);
  }
};

function createDOMForm(option) {
  return (0, _createBaseForm2.default)(_extends({}, option), [mixin]);
}

exports.default = createDOMForm;
module.exports = exports['default'];