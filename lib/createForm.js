'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createBaseForm = require('./createBaseForm');

var _createBaseForm2 = _interopRequireDefault(_createBaseForm);

var mixin = {
  getForm: function getForm() {
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
      validateFields: this.validateFields,
      resetFields: this.resetFields
    };
  }
};

exports.mixin = mixin;
function createForm(options) {
  return (0, _createBaseForm2['default'])(options, [mixin]);
}

exports['default'] = createForm;