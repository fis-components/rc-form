'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

var defaultValidateTrigger = 'onChange';
var defaultTrigger = defaultValidateTrigger;

function createForm() {
  var option = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var mapPropsToFields = option.mapPropsToFields;
  var onFieldsChange = option.onFieldsChange;
  var fieldNameProp = option.fieldNameProp;
  var fieldMetaProp = option.fieldMetaProp;
  var validateMessages = option.validateMessages;
  var refComponent = option.refComponent;
  var _option$mapProps = option.mapProps;
  var mapProps = _option$mapProps === undefined ? _utils.mirror : _option$mapProps;
  var _option$formPropName = option.formPropName;
  var formPropName = _option$formPropName === undefined ? 'form' : _option$formPropName;
  var withRef = option.withRef;

  function decorate(WrappedComponent) {
    var Form = (function (_Component) {
      _inherits(Form, _Component);

      function Form() {
        var _this = this;

        _classCallCheck(this, Form);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).apply(this, args);
        var fields = undefined;
        if (mapPropsToFields) {
          fields = mapPropsToFields(this.props);
        }
        this.state = {
          submitting: false
        };
        this.fields = fields || {};
        this.fieldsMeta = {};
        this.cachedBind = {};
        var bindMethods = ['getFieldProps', 'isFieldValidating', 'submit', 'isSubmitting', 'getFieldError', 'setFields', 'resetFields', 'validateFieldsByName', 'getFieldsValue', 'saveRef', 'setFieldsInitialValue', 'isFieldsValidating', 'setFieldsValue', 'getFieldValue'];
        bindMethods.forEach(function (m) {
          _this[m] = _this[m].bind(_this);
        });
      }

      _createClass(Form, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.componentDidUpdate();
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (mapPropsToFields) {
            var fields = mapPropsToFields(nextProps);
            if (fields) {
              this.fields = _extends({}, this.fields, fields);
            }
          }
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          var fields = this.fields;
          var fieldsMeta = this.fieldsMeta;

          var fieldsMetaKeys = Object.keys(fieldsMeta);
          fieldsMetaKeys.forEach(function (s) {
            if (fieldsMeta[s].stale) {
              delete fieldsMeta[s];
            }
          });
          var fieldsKeys = Object.keys(fields);
          fieldsKeys.forEach(function (s) {
            if (!fieldsMeta[s]) {
              delete fields[s];
            }
          });
          // do not notify store
        }
      }, {
        key: 'onChange',
        value: function onChange(name, action, event) {
          var fieldMeta = this.getFieldMeta(name);
          var validate = fieldMeta.validate;

          if (fieldMeta[action]) {
            fieldMeta[action](event);
          }
          var value = (0, _utils.getValueFromEvent)(event);
          var field = this.getField(name, true);
          this.setFields(_defineProperty({}, name, _extends({}, field, {
            value: value,
            dirty: this.hasRules(validate)
          })));
        }
      }, {
        key: 'onChangeValidate',
        value: function onChangeValidate(name, action, event) {
          var fieldMeta = this.getFieldMeta(name);
          if (fieldMeta[action]) {
            fieldMeta[action](event);
          }
          var value = (0, _utils.getValueFromEvent)(event);
          var field = this.getField(name, true);
          field.value = value;
          field.dirty = true;
          this.validateFields([field], {
            action: action,
            options: {
              firstFields: !!fieldMeta.validateFirst
            }
          });
        }
      }, {
        key: 'getCacheBind',
        value: function getCacheBind(name, action, fn) {
          var cache = this.cachedBind[name] = this.cachedBind[name] || {};
          if (!cache[action]) {
            cache[action] = fn.bind(this, name, action);
          }
          return cache[action];
        }
      }, {
        key: 'getFieldMeta',
        value: function getFieldMeta(name) {
          return this.fieldsMeta[name];
        }
      }, {
        key: 'getField',
        value: function getField(name, copy) {
          var ret = this.fields[name];
          if (ret) {
            ret.name = name;
          }
          if (copy) {
            if (ret) {
              return _extends({}, ret);
            }
            return { name: name };
          }
          return ret;
        }
      }, {
        key: 'getFieldProps',
        value: function getFieldProps(name) {
          var _this2 = this;

          var fieldOption = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var rules = fieldOption.rules;
          var _fieldOption$trigger = fieldOption.trigger;
          var trigger = _fieldOption$trigger === undefined ? defaultTrigger : _fieldOption$trigger;
          var _fieldOption$valuePropName = fieldOption.valuePropName;
          var valuePropName = _fieldOption$valuePropName === undefined ? 'value' : _fieldOption$valuePropName;
          var _fieldOption$validateTrigger = fieldOption.validateTrigger;
          var validateTrigger = _fieldOption$validateTrigger === undefined ? defaultValidateTrigger : _fieldOption$validateTrigger;
          var _fieldOption$validate = fieldOption.validate;
          var validate = _fieldOption$validate === undefined ? [] : _fieldOption$validate;

          var fieldMeta = this.fieldsMeta[name] || {};

          if ('initialValue' in fieldOption) {
            fieldMeta.initialValue = fieldOption.initialValue;
          }

          var inputProps = _defineProperty({}, valuePropName, fieldMeta.initialValue);

          if (fieldNameProp) {
            inputProps[fieldNameProp] = name;
          }

          var validateRules = validate.map(function (item) {
            item.trigger = item.trigger || [];
            if (typeof item.trigger === 'string') {
              item.trigger = [item.trigger];
            }
            return item;
          });

          if (rules) {
            validateRules.push({
              trigger: validateTrigger ? [].concat(validateTrigger) : [],
              rules: rules
            });
          }

          validateRules.filter(function (item) {
            return !!item.rules && item.rules.length;
          }).map(function (item) {
            return item.trigger;
          }).reduce(function (pre, curr) {
            return pre.concat(curr);
          }, []).forEach(function (action) {
            inputProps[action] = _this2.getCacheBind(name, action, _this2.onChangeValidate);
          });

          if (trigger && validateRules.every(function (item) {
            return item.trigger.indexOf(trigger) === -1 || !item.rules || !item.rules.length;
          })) {
            inputProps[trigger] = this.getCacheBind(name, trigger, this.onChange);
          }
          var field = this.getField(name);
          if (field && 'value' in field) {
            inputProps[valuePropName] = field.value;
          }

          if (refComponent) {
            inputProps.ref = this.getCacheBind(name, name + '__ref', this.saveRef);
          }

          var meta = _extends({}, fieldMeta, fieldOption, {
            validate: validateRules,
            stale: 0
          });

          this.fieldsMeta[name] = meta;

          if (fieldMetaProp) {
            inputProps[fieldMetaProp] = meta;
          }

          return inputProps;
        }
      }, {
        key: 'getFieldMember',
        value: function getFieldMember(name, member) {
          var field = this.getField(name);
          return field && field[member];
        }
      }, {
        key: 'getFieldError',
        value: function getFieldError(name) {
          return (0, _utils.getErrorStrs)(this.getFieldMember(name, 'errors'));
        }
      }, {
        key: 'getValidFieldsName',
        value: function getValidFieldsName() {
          var fieldsMeta = this.fieldsMeta;
          return fieldsMeta ? Object.keys(fieldsMeta).filter(function (name) {
            return !fieldsMeta[name].hidden;
          }) : [];
        }
      }, {
        key: 'getFieldsValue',
        value: function getFieldsValue(names) {
          var _this3 = this;

          var fields = names || this.getValidFieldsName();
          var allValues = {};
          fields.forEach(function (f) {
            allValues[f] = _this3.getFieldValue(f);
          });
          return allValues;
        }
      }, {
        key: 'getFieldValue',
        value: function getFieldValue(name) {
          var fields = this.fields;

          return this.getValueFromFields(name, fields);
        }
      }, {
        key: 'getValueFromFields',
        value: function getValueFromFields(name, fields) {
          var fieldsMeta = this.fieldsMeta;

          var field = fields[name];
          if (field && 'value' in field) {
            return field.value;
          }
          var fieldMeta = fieldsMeta[name];
          return fieldMeta && fieldMeta.initialValue;
        }
      }, {
        key: 'getRules',
        value: function getRules(fieldMeta, action) {
          var actionRules = fieldMeta.validate.filter(function (item) {
            return !action || item.trigger.indexOf(action) >= 0;
          }).map(function (item) {
            return item.rules;
          });
          return (0, _utils.flattenArray)(actionRules);
        }
      }, {
        key: 'getForm',
        value: function getForm() {
          return {
            getFieldsValue: this.getFieldsValue,
            getFieldValue: this.getFieldValue,
            setFieldsValue: this.setFieldsValue,
            setFields: this.setFields,
            setFieldsInitialValue: this.setFieldsInitialValue,
            getFieldProps: this.getFieldProps,
            getFieldError: this.getFieldError,
            isFieldValidating: this.isFieldValidating,
            isFieldsValidating: this.isFieldsValidating,
            isSubmitting: this.isSubmitting,
            submit: this.submit,
            validateFields: this.validateFieldsByName,
            resetFields: this.resetFields
          };
        }
      }, {
        key: 'setFields',
        value: function setFields(fields) {
          var _this4 = this;

          var originalFields = this.fields;
          var nowFields = _extends({}, originalFields, fields);
          var fieldsMeta = this.fieldsMeta;
          var nowValues = {};
          Object.keys(fieldsMeta).forEach(function (f) {
            nowValues[f] = _this4.getValueFromFields(f, nowFields);
          });
          var changedFieldsName = Object.keys(fields);
          Object.keys(nowValues).forEach(function (f) {
            var value = nowValues[f];
            var fieldMeta = fieldsMeta[f];
            if (fieldMeta && fieldMeta.normalize) {
              var nowValue = fieldMeta.normalize(value, _this4.getValueFromFields(f, originalFields), nowValues);
              if (nowValue !== value) {
                nowFields[f] = _extends({}, nowFields[f], { value: nowValue });
                if (changedFieldsName.indexOf(f) === -1) {
                  changedFieldsName.push(f);
                }
              }
            }
          });
          this.fields = nowFields;
          if (onFieldsChange) {
            (function () {
              var changedFields = {};
              changedFieldsName.forEach(function (f) {
                changedFields[f] = nowFields[f];
              });
              onFieldsChange(_this4.props, changedFields);
            })();
          }
          this.forceUpdate();
        }
      }, {
        key: 'setFieldsValue',
        value: function setFieldsValue(fieldsValue) {
          var fields = {};
          for (var _name in fieldsValue) {
            if (fieldsValue.hasOwnProperty(_name)) {
              fields[_name] = {
                name: _name,
                value: fieldsValue[_name]
              };
            }
          }
          this.setFields(fields);
        }
      }, {
        key: 'setFieldsInitialValue',
        value: function setFieldsInitialValue(initialValues) {
          var fieldsMeta = this.fieldsMeta;
          for (var _name2 in initialValues) {
            if (initialValues.hasOwnProperty(_name2)) {
              var fieldMeta = fieldsMeta[_name2];
              fieldsMeta[_name2] = _extends({}, fieldMeta, {
                initialValue: initialValues[_name2]
              });
            }
          }
        }
      }, {
        key: 'saveRef',
        value: function saveRef(name, _, component) {
          var fieldMeta = this.getFieldMeta(name);
          if (fieldMeta && fieldMeta.ref) {
            if (typeof fieldMeta.ref === 'string') {
              throw new Error('can not set ref string for ' + name);
            }
            fieldMeta.ref(component);
          }
          this.fields[name] = this.fields[name] || {};
          this.fields[name].instance = component;
        }
      }, {
        key: 'hasRules',
        value: function hasRules(validate) {
          if (validate) {
            return validate.some(function (item) {
              return !!item.rules && item.rules.length;
            });
          }
          return false;
        }
      }, {
        key: 'validateFields',
        value: function validateFields(fields, _ref, callback) {
          var _this5 = this;

          var fieldNames = _ref.fieldNames;
          var action = _ref.action;
          var _ref$options = _ref.options;
          var options = _ref$options === undefined ? {} : _ref$options;

          var allRules = {};
          var allValues = {};
          var allFields = {};
          var alreadyErrors = {};
          fields.forEach(function (field) {
            var name = field.name;
            if (options.force !== true && field.dirty === false) {
              if (field.errors) {
                alreadyErrors[name] = {
                  errors: field.errors,
                  instance: field.instance
                };
              }
              return;
            }
            var fieldMeta = _this5.getFieldMeta(name);
            field.errors = undefined;
            field.validating = true;
            field.dirty = true;
            allRules[name] = _this5.getRules(fieldMeta, action);
            allValues[name] = field.value;
            allFields[name] = field;
          });
          this.setFields(allFields);
          var nowFields = this.fields;
          // in case normalize
          Object.keys(allValues).forEach(function (f) {
            allValues[f] = nowFields[f].value;
          });
          if (callback && (0, _utils.isEmptyObject)(allFields)) {
            callback((0, _utils.isEmptyObject)(alreadyErrors) ? null : alreadyErrors, this.getFieldsValue(fieldNames));
            return;
          }
          var validator = new _asyncValidator2['default'](allRules);
          if (validateMessages) {
            validator.messages(validateMessages);
          }
          validator.validate(allValues, options, function (errors) {
            var errorsGroup = _extends({}, alreadyErrors);
            if (errors && errors.length) {
              errors.forEach(function (e) {
                var fieldName = e.field;
                errorsGroup[fieldName] = errorsGroup[fieldName] || { errors: [] };
                var fieldErrors = errorsGroup[fieldName].errors;
                fieldErrors.push(e);
              });
            }
            var expired = [];
            var nowAllFields = {};
            Object.keys(allRules).forEach(function (name) {
              var fieldErrors = errorsGroup[name];
              var nowField = _this5.getField(name, true);
              // avoid concurrency problems
              if (nowField.value !== allValues[name]) {
                expired.push({ name: name, instance: nowField.instance });
              } else {
                nowField.errors = fieldErrors && fieldErrors.errors;
                nowField.value = allValues[name];
                nowField.validating = false;
                nowField.dirty = false;
                nowAllFields[name] = nowField;
              }
              if (fieldErrors) {
                fieldErrors.instance = nowField.instance;
              }
            });
            _this5.setFields(nowAllFields);
            if (callback) {
              if (expired.length) {
                expired.forEach(function (_ref2) {
                  var name = _ref2.name;
                  var instance = _ref2.instance;

                  var fieldErrors = [{ message: name + ' need to revalidate', field: name }];
                  errorsGroup[name] = {
                    expired: true,
                    instance: instance,
                    errors: fieldErrors
                  };
                });
              }
              callback((0, _utils.isEmptyObject)(errorsGroup) ? null : errorsGroup, _this5.getFieldsValue(fieldNames));
            }
          });
        }
      }, {
        key: 'validateFieldsByName',
        value: function validateFieldsByName(ns, opt, cb) {
          var _this6 = this;

          var names = ns;
          var callback = cb;
          var options = opt;
          if (typeof names === 'function') {
            callback = names;
            options = {};
            names = undefined;
          } else if (Array.isArray(ns)) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            } else {
              options = options || {};
            }
          } else {
            callback = options;
            options = names || {};
            names = undefined;
          }
          var fieldNames = names || this.getValidFieldsName();
          var fields = fieldNames.map(function (name) {
            var fieldMeta = _this6.getFieldMeta(name);
            if (!_this6.hasRules(fieldMeta.validate)) {
              return null;
            }
            var field = _this6.getField(name, true);
            field.value = _this6.getFieldValue(name);
            return field;
          }).filter(function (f) {
            return !!f;
          });
          if (!fields.length) {
            if (callback) {
              callback(null, this.getFieldsValue(fieldNames));
            }
            return;
          }
          if (!('firstFields' in options)) {
            options.firstFields = fieldNames.filter(function (name) {
              var fieldMeta = _this6.getFieldMeta(name);
              return !!fieldMeta.validateFirst;
            });
          }
          this.validateFields(fields, { fieldNames: fieldNames, options: options }, callback);
        }
      }, {
        key: 'isFieldValidating',
        value: function isFieldValidating(name) {
          return this.getFieldMember(name, 'validating');
        }
      }, {
        key: 'isFieldsValidating',
        value: function isFieldsValidating(ns) {
          var names = ns || this.getValidFieldsName();
          return names.some(this.isFieldValidating);
        }
      }, {
        key: 'isSubmitting',
        value: function isSubmitting() {
          return this.state.submitting;
        }
      }, {
        key: 'submit',
        value: function submit(callback) {
          var _this7 = this;

          var fn = function fn() {
            _this7.setState({
              submitting: false
            });
          };
          this.setState({
            submitting: true
          });
          callback(fn);
        }
      }, {
        key: 'resetFields',
        value: function resetFields(ns) {
          var newFields = {};
          var fields = this.fields;

          var changed = false;
          var names = ns || Object.keys(fields);
          names.forEach(function (name) {
            var field = fields[name];
            if (field && 'value' in field) {
              changed = true;
              newFields[name] = {};
            }
          });
          if (changed) {
            this.setFields(newFields);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var formProps = _defineProperty({}, formPropName, this.getForm());
          var fieldsMeta = this.fieldsMeta;
          for (var _name3 in fieldsMeta) {
            if (fieldsMeta.hasOwnProperty(_name3)) {
              fieldsMeta[_name3].stale = 1;
            }
          }
          if (withRef) {
            formProps.ref = 'wrappedComponent';
          }
          var props = mapProps.call(this, _extends({}, formProps, this.props));
          return _react2['default'].createElement(WrappedComponent, props);
        }
      }]);

      return Form;
    })(_react.Component);

    return (0, _utils.argumentContainer)(Form, WrappedComponent);
  }

  return decorate;
}

exports['default'] = createForm;
module.exports = exports['default'];