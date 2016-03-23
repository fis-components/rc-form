'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultValidateTrigger = 'onChange';
var defaultTrigger = defaultValidateTrigger;

function createBaseForm() {
  var option = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var mixins = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var mapPropsToFields = option.mapPropsToFields;
  var onFieldsChange = option.onFieldsChange;
  var fieldNameProp = option.fieldNameProp;
  var fieldMetaProp = option.fieldMetaProp;
  var validateMessages = option.validateMessages;
  var _option$mapProps = option.mapProps;
  var mapProps = _option$mapProps === undefined ? _utils.mirror : _option$mapProps;
  var _option$formPropName = option.formPropName;
  var formPropName = _option$formPropName === undefined ? 'form' : _option$formPropName;
  var withRef = option.withRef;


  function decorate(WrappedComponent) {
    var Form = _react2.default.createClass({
      displayName: 'Form',

      mixins: mixins,

      getInitialState: function getInitialState() {
        var fields = undefined;
        if (mapPropsToFields) {
          fields = mapPropsToFields(this.props);
        }
        this.fields = fields || {};
        this.fieldsMeta = {};
        this.cachedBind = {};
        return {
          submitting: false
        };
      },
      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (mapPropsToFields) {
          var fields = mapPropsToFields(nextProps);
          if (fields) {
            var instanceFields = this.fields = _extends({}, this.fields);
            for (var fieldName in fields) {
              if (fields.hasOwnProperty(fieldName)) {
                instanceFields[fieldName] = _extends({}, fields[fieldName], {
                  // keep instance
                  instance: instanceFields[fieldName] && instanceFields[fieldName].instance
                });
              }
            }
          }
        }
      },
      onChange: function onChange(name, action, event) {
        var fieldMeta = this.getFieldMeta(name);
        var validate = fieldMeta.validate;

        if (fieldMeta[action]) {
          fieldMeta[action](event);
        }
        var value = (0, _utils.getValueFromEvent)(event);
        var field = this.getField(name, true);
        this.setFields(_defineProperty({}, name, _extends({}, field, {
          value: value,
          dirty: (0, _utils.hasRules)(validate)
        })));
      },
      onChangeValidate: function onChangeValidate(name, action, event) {
        var fieldMeta = this.getFieldMeta(name);
        if (fieldMeta[action]) {
          fieldMeta[action](event);
        }
        var value = (0, _utils.getValueFromEvent)(event);
        var field = this.getField(name, true);
        field.value = value;
        field.dirty = true;
        this.validateFieldsInternal([field], {
          action: action,
          options: {
            firstFields: !!fieldMeta.validateFirst
          }
        });
      },
      getCacheBind: function getCacheBind(name, action, fn) {
        var cache = this.cachedBind[name] = this.cachedBind[name] || {};
        if (!cache[action]) {
          cache[action] = fn.bind(this, name, action);
        }
        return cache[action];
      },
      getFieldMeta: function getFieldMeta(name) {
        return this.fieldsMeta[name];
      },
      getField: function getField(name, copy) {
        var ret = this.fields[name];
        if (ret) {
          ret.name = name;
        }
        if (copy) {
          if (ret) {
            return _extends({}, ret);
          }
          return {
            name: name
          };
        }
        return ret;
      },
      getFieldProps: function getFieldProps(name) {
        var _this = this;

        var fieldOption = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var rules = fieldOption.rules;
        var _fieldOption$trigger = fieldOption.trigger;
        var trigger = _fieldOption$trigger === undefined ? defaultTrigger : _fieldOption$trigger;
        var _fieldOption$valuePro = fieldOption.valuePropName;
        var valuePropName = _fieldOption$valuePro === undefined ? 'value' : _fieldOption$valuePro;
        var _fieldOption$validate = fieldOption.validateTrigger;
        var validateTrigger = _fieldOption$validate === undefined ? defaultValidateTrigger : _fieldOption$validate;
        var _fieldOption$validate2 = fieldOption.validate;
        var validate = _fieldOption$validate2 === undefined ? [] : _fieldOption$validate2;


        var fieldMeta = this.fieldsMeta[name] || {};

        if ('initialValue' in fieldOption) {
          fieldMeta.initialValue = fieldOption.initialValue;
        }

        var inputProps = _defineProperty({}, valuePropName, fieldMeta.initialValue);

        if (fieldNameProp) {
          inputProps[fieldNameProp] = name;
        }

        var validateRules = validate.map(function (item) {
          var newItem = _extends({}, item, {
            trigger: item.trigger || []
          });
          if (typeof newItem.trigger === 'string') {
            newItem.trigger = [newItem.trigger];
          }
          return newItem;
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
          inputProps[action] = _this.getCacheBind(name, action, _this.onChangeValidate);
        });

        function checkRule(item) {
          return item.trigger.indexOf(trigger) === -1 || !item.rules || !item.rules.length;
        }

        if (trigger && validateRules.every(checkRule)) {
          inputProps[trigger] = this.getCacheBind(name, trigger, this.onChange);
        }
        var field = this.getField(name);
        if (field && 'value' in field) {
          inputProps[valuePropName] = field.value;
        }

        inputProps.ref = this.getCacheBind(name, name + '__ref', this.saveRef);

        var meta = _extends({}, fieldMeta, fieldOption, {
          validate: validateRules
        });

        this.fieldsMeta[name] = meta;

        if (fieldMetaProp) {
          inputProps[fieldMetaProp] = meta;
        }

        return inputProps;
      },
      getFieldMember: function getFieldMember(name, member) {
        var field = this.getField(name);
        return field && field[member];
      },
      getFieldError: function getFieldError(name) {
        return (0, _utils.getErrorStrs)(this.getFieldMember(name, 'errors'));
      },
      getValidFieldsName: function getValidFieldsName() {
        var fieldsMeta = this.fieldsMeta;
        return fieldsMeta ? Object.keys(fieldsMeta).filter(function (name) {
          return !fieldsMeta[name].hidden;
        }) : [];
      },
      getFieldsValue: function getFieldsValue(names) {
        var _this2 = this;

        var fields = names || this.getValidFieldsName();
        var allValues = {};
        fields.forEach(function (f) {
          allValues[f] = _this2.getFieldValue(f);
        });
        return allValues;
      },
      getFieldValue: function getFieldValue(name) {
        var fields = this.fields;

        return this.getValueFromFields(name, fields);
      },
      getFieldInstance: function getFieldInstance(name) {
        var fields = this.fields;

        return fields[name] && fields[name].instance;
      },
      getValueFromFields: function getValueFromFields(name, fields) {
        var fieldsMeta = this.fieldsMeta;

        var field = fields[name];
        if (field && 'value' in field) {
          return field.value;
        }
        var fieldMeta = fieldsMeta[name];
        return fieldMeta && fieldMeta.initialValue;
      },
      getRules: function getRules(fieldMeta, action) {
        var actionRules = fieldMeta.validate.filter(function (item) {
          return !action || item.trigger.indexOf(action) >= 0;
        }).map(function (item) {
          return item.rules;
        });
        return (0, _utils.flattenArray)(actionRules);
      },
      setFields: function setFields(fields) {
        var _this3 = this;

        var originalFields = this.fields;
        var nowFields = _extends({}, originalFields, fields);
        var fieldsMeta = this.fieldsMeta;
        var nowValues = {};
        Object.keys(fieldsMeta).forEach(function (f) {
          nowValues[f] = _this3.getValueFromFields(f, nowFields);
        });
        var changedFieldsName = Object.keys(fields);
        Object.keys(nowValues).forEach(function (f) {
          var value = nowValues[f];
          var fieldMeta = fieldsMeta[f];
          if (fieldMeta && fieldMeta.normalize) {
            var nowValue = fieldMeta.normalize(value, _this3.getValueFromFields(f, originalFields), nowValues);
            if (nowValue !== value) {
              nowFields[f] = _extends({}, nowFields[f], {
                value: nowValue
              });
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
            onFieldsChange(_this3.props, changedFields);
          })();
        }
        this.forceUpdate();
      },
      setFieldsValue: function setFieldsValue(fieldsValue) {
        var fields = {};
        for (var name in fieldsValue) {
          if (fieldsValue.hasOwnProperty(name)) {
            fields[name] = {
              name: name,
              value: fieldsValue[name]
            };
          }
        }
        this.setFields(fields);
      },
      setFieldsInitialValue: function setFieldsInitialValue(initialValues) {
        var fieldsMeta = this.fieldsMeta;
        for (var name in initialValues) {
          if (initialValues.hasOwnProperty(name)) {
            var fieldMeta = fieldsMeta[name];
            fieldsMeta[name] = _extends({}, fieldMeta, {
              initialValue: initialValues[name]
            });
          }
        }
      },
      saveRef: function saveRef(name, _, component) {
        if (!component) {
          // after destroy, delete data
          delete this.fieldsMeta[name];
          delete this.fields[name];
          return;
        }
        var fieldMeta = this.getFieldMeta(name);
        if (fieldMeta && fieldMeta.ref) {
          if (typeof fieldMeta.ref === 'string') {
            throw new Error('can not set ref string for ' + name);
          }
          fieldMeta.ref(component);
        }
        this.fields[name] = this.fields[name] || {};
        this.fields[name].instance = component;
      },
      validateFieldsInternal: function validateFieldsInternal(fields, _ref, callback) {
        var _this4 = this;

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
          var fieldMeta = _this4.getFieldMeta(name);
          var newField = _extends({}, field);
          newField.errors = undefined;
          newField.validating = true;
          newField.dirty = true;
          allRules[name] = _this4.getRules(fieldMeta, action);
          allValues[name] = newField.value;
          allFields[name] = newField;
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
        var validator = new _asyncValidator2.default(allRules);
        if (validateMessages) {
          validator.messages(validateMessages);
        }
        validator.validate(allValues, options, function (errors) {
          var errorsGroup = _extends({}, alreadyErrors);
          if (errors && errors.length) {
            errors.forEach(function (e) {
              var fieldName = e.field;
              if (!errorsGroup[fieldName]) {
                errorsGroup[fieldName] = {
                  errors: []
                };
              }
              var fieldErrors = errorsGroup[fieldName].errors;
              fieldErrors.push(e);
            });
          }
          var expired = [];
          var nowAllFields = {};
          Object.keys(allRules).forEach(function (name) {
            var fieldErrors = errorsGroup[name];
            var nowField = _this4.getField(name, true);
            // avoid concurrency problems
            if (nowField.value !== allValues[name]) {
              expired.push({
                name: name,
                instance: nowField.instance
              });
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
          _this4.setFields(nowAllFields);
          if (callback) {
            if (expired.length) {
              expired.forEach(function (_ref2) {
                var name = _ref2.name;
                var instance = _ref2.instance;

                var fieldErrors = [{
                  message: name + ' need to revalidate',
                  field: name
                }];
                errorsGroup[name] = {
                  expired: true,
                  instance: instance,
                  errors: fieldErrors
                };
              });
            }
            callback((0, _utils.isEmptyObject)(errorsGroup) ? null : errorsGroup, _this4.getFieldsValue(fieldNames));
          }
        });
      },
      validateFields: function validateFields(ns, opt, cb) {
        var _this5 = this;

        var _getParams = (0, _utils.getParams)(ns, opt, cb);

        var names = _getParams.names;
        var callback = _getParams.callback;
        var options = _getParams.options;

        var fieldNames = names || this.getValidFieldsName();
        var fields = fieldNames.map(function (name) {
          var fieldMeta = _this5.getFieldMeta(name);
          if (!(0, _utils.hasRules)(fieldMeta.validate)) {
            return null;
          }
          var field = _this5.getField(name, true);
          field.value = _this5.getFieldValue(name);
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
            var fieldMeta = _this5.getFieldMeta(name);
            return !!fieldMeta.validateFirst;
          });
        }
        this.validateFieldsInternal(fields, {
          fieldNames: fieldNames,
          options: options
        }, callback);
      },
      isFieldValidating: function isFieldValidating(name) {
        return this.getFieldMember(name, 'validating');
      },
      isFieldsValidating: function isFieldsValidating(ns) {
        var names = ns || this.getValidFieldsName();
        return names.some(this.isFieldValidating);
      },
      isSubmitting: function isSubmitting() {
        return this.state.submitting;
      },
      submit: function submit(callback) {
        var _this6 = this;

        var fn = function fn() {
          _this6.setState({
            submitting: false
          });
        };
        this.setState({
          submitting: true
        });
        callback(fn);
      },
      resetFields: function resetFields(ns) {
        var newFields = {};
        var fields = this.fields;

        var changed = false;
        var names = ns || Object.keys(fields);
        names.forEach(function (name) {
          var field = fields[name];
          if (field && 'value' in field) {
            changed = true;
            newFields[name] = {
              instance: field.instance
            };
          }
        });
        if (changed) {
          this.setFields(newFields);
        }
      },
      render: function render() {
        var formProps = _defineProperty({}, formPropName, this.getForm());
        if (withRef) {
          formProps.ref = 'wrappedComponent';
        }
        var props = mapProps.call(this, _extends({}, formProps, this.props));
        return _react2.default.createElement(WrappedComponent, props);
      }
    });

    return (0, _utils.argumentContainer)(Form, WrappedComponent);
  }

  return decorate;
}

exports.default = createBaseForm;
module.exports = exports['default'];