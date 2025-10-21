import { describe, getCourse, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Language Picker - v5.3.0 to v5.4.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v5.3.0..v5.4.0

  let course, config, courseLanguagePickerGlobals;
  const navTooltip = {
    _isEnabled: true,
    text: 'Select course language'
  };

  whereFromPlugin('Language Picker - from v5.3.0', { name: 'adapt-contrib-languagePicker', version: '<5.4.0' });

  whereContent('Language Picker is configured', content => {
    config = getConfig();
    return config._languagePicker;
  });

  mutateContent('Language Picker - add globals if missing', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._extensions._languagePicker')) _.set(course, '_globals._extensions._languagePicker', {});
    courseLanguagePickerGlobals = course._globals._extensions._languagePicker;
    return true;
  });

  mutateContent('Language Picker - add attribute _navOrder', async (content) => {
    courseLanguagePickerGlobals._navOrder = 0;
    return true;
  });

  mutateContent('Language Picker - add attribute _navTooltip', async (content) => {
    courseLanguagePickerGlobals._navTooltip = navTooltip;
    return true;
  });

  mutateContent('Language Picker - add attribute _showLabel', async (content) => {
    courseLanguagePickerGlobals._showLabel = true;
    return true;
  });

  mutateContent('Language Picker - add attribute _drawerPosition', async (content) => {
    courseLanguagePickerGlobals._drawerPosition = 'auto';
    return true;
  });

  checkContent('Language Picker - check attribute _navOrder', async (content) => {
    const isValid = courseLanguagePickerGlobals._navOrder === 0;
    if (!isValid) throw new Error('Language Picker - global attribute _navOrder');
    return true;
  });

  checkContent('Language Picker - check attribute _navTooltip', async (content) => {
    const isValid = _.isEqual(courseLanguagePickerGlobals._navTooltip, navTooltip);
    if (!isValid) throw new Error('Language Picker - global attribute _navTooltip');
    return true;
  });

  checkContent('Language Picker - check attribute _showLabel', async (content) => {
    const isValid = courseLanguagePickerGlobals._showLabel === true;
    if (!isValid) throw new Error('Language Picker - global attribute _showLabel');
    return true;
  });

  checkContent('Language Picker - check attribute _drawerPosition', async (content) => {
    const isValid = courseLanguagePickerGlobals._drawerPosition === 'auto';
    if (!isValid) throw new Error('Language Picker - global attribute _drawerPosition');
    return true;
  });


  updatePlugin('Language Picker - update to v5.4.0', { name: 'adapt-contrib-languagePicker', version: '5.4.0', framework: '">=5.30.2' });

  testSuccessWhere('languagePicker with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.3.0' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('languagePicker with globals', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.3.0' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course', _globals: { _extensions: { _languagePicker: {} } } }
    ]
  });

  testSuccessWhere('languagePicker with no _type and empty course', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.3.0' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course' }
    ]
  });

  testStopWhere('languagePicker with empty config', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.3.0' }],
    content: [
      { _type: 'config' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.4.0' }],
    content: [
      { _type: 'config' }
    ]
  });
});

describe('adapt-contrib-languagePicker - 5.6.0 to 5.7.0', async () => {
  let config, backgroundStyles;

  whereFromPlugin('adapt-contrib-languagePicker - from 5.6.0', { name: 'adapt-contrib-languagePicker', version: '<5.7.0' });

  whereContent('Language Picker is configured', content => {
    config = getConfig();
    return config._languagePicker;
  });

  mutateContent('Language Picker - add _graphic object', async () => {
    if (!_.has(config._languagePicker, '_graphic')) {
      config._languagePicker._graphic = {};
    }
    return true;
  });

  mutateContent('Language Picker - add _graphic.src property', async () => {
    if (!_.has(config._languagePicker._graphic, 'src')) {
      config._languagePicker._graphic.src = '';
    }
    return true;
  });

  mutateContent('Language Picker - add _graphic.alt property', async () => {
    if (!_.has(config._languagePicker._graphic, 'alt')) {
      config._languagePicker._graphic.alt = '';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundImage object', async () => {
    if (!_.has(config._languagePicker, '_backgroundImage')) {
      config._languagePicker._backgroundImage = {};
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundImage._xlarge property', async () => {
    if (!_.has(config._languagePicker._backgroundImage, '_xlarge')) {
      config._languagePicker._backgroundImage._xlarge = '';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundImage._large property', async () => {
    if (!_.has(config._languagePicker._backgroundImage, '_large')) {
      config._languagePicker._backgroundImage._large = '';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundImage._medium property', async () => {
    if (!_.has(config._languagePicker._backgroundImage, '_medium')) {
      config._languagePicker._backgroundImage._medium = '';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundImage._small property', async () => {
    if (!_.has(config._languagePicker._backgroundImage, '_small')) {
      config._languagePicker._backgroundImage._small = '';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundStyles object', async () => {
    if (!_.has(config._languagePicker, '_backgroundStyles')) {
      config._languagePicker._backgroundStyles = {};
    }
    backgroundStyles = config._languagePicker._backgroundStyles;
    return true;
  });

  mutateContent('Language Picker - add _backgroundStyles._backgroundSize property', async () => {
    if (!_.has(backgroundStyles, '_backgroundSize')) {
      backgroundStyles._backgroundSize = 'cover';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundStyles._backgroundRepeat property', async () => {
    if (!_.has(backgroundStyles, '_backgroundRepeat')) {
      backgroundStyles._backgroundRepeat = 'no-repeat';
    }
    return true;
  });

  mutateContent('Language Picker - add _backgroundStyles._backgroundPosition property', async () => {
    if (!_.has(backgroundStyles, '_backgroundPosition')) {
      backgroundStyles._backgroundPosition = 'center center';
    }
    return true;
  });

  checkContent('Language Picker - check _graphic object', async () => {
    const isValid = _.has(config._languagePicker, '_graphic');
    if (!isValid) throw new Error('Language Picker - _graphic object');
    return true;
  });

  checkContent('Language Picker - check _graphic.src property', async () => {
    const isValid = _.has(config._languagePicker._graphic, 'src');
    if (!isValid) throw new Error('Language Picker - _graphic.src property');
    return true;
  });

  checkContent('Language Picker - check _graphic.alt property', async () => {
    const isValid = _.has(config._languagePicker._graphic, 'alt');
    if (!isValid) throw new Error('Language Picker - _graphic.alt property');
    return true;
  });

  checkContent('Language Picker - check _backgroundImage object', async () => {
    const isValid = _.has(config._languagePicker, '_backgroundImage');
    if (!isValid) throw new Error('Language Picker - _backgroundImage object');
    return true;
  });

  checkContent('Language Picker - check _backgroundImage._xlarge property', async () => {
    const isValid = _.has(config._languagePicker._backgroundImage, '_xlarge');
    if (!isValid) throw new Error('Language Picker - _backgroundImage._xlarge property');
    return true;
  });

  checkContent('Language Picker - check _backgroundImage._large property', async () => {
    const isValid = _.has(config._languagePicker._backgroundImage, '_large');
    if (!isValid) throw new Error('Language Picker - _backgroundImage._large property');
    return true;
  });

  checkContent('Language Picker - check _backgroundImage._medium property', async () => {
    const isValid = _.has(config._languagePicker._backgroundImage, '_medium');
    if (!isValid) throw new Error('Language Picker - _backgroundImage._medium property');
    return true;
  });

  checkContent('Language Picker - check _backgroundImage._small property', async () => {
    const isValid = _.has(config._languagePicker._backgroundImage, '_small');
    if (!isValid) throw new Error('Language Picker - _backgroundImage._small property');
    return true;
  });

  checkContent('Language Picker - check _backgroundStyles object', async () => {
    const isValid = _.has(config._languagePicker, '_backgroundStyles');
    if (!isValid) throw new Error('Language Picker - _backgroundStyles object');
    return true;
  });

  checkContent('Language Picker - check _backgroundStyles._backgroundSize property', async () => {
    const isValid = _.has(backgroundStyles, '_backgroundSize') && backgroundStyles._backgroundSize === 'cover';
    if (!isValid) throw new Error('Language Picker - _backgroundStyles._backgroundSize property');
    return true;
  });

  checkContent('Language Picker - check _backgroundStyles._backgroundRepeat property', async () => {
    const isValid = _.has(backgroundStyles, '_backgroundRepeat') && backgroundStyles._backgroundRepeat === 'no-repeat';
    if (!isValid) throw new Error('Language Picker - _backgroundStyles._backgroundRepeat property');
    return true;
  });

  checkContent('Language Picker - check _backgroundStyles._backgroundPosition property', async () => {
    const isValid = _.has(backgroundStyles, '_backgroundPosition') && backgroundStyles._backgroundPosition === 'center center';
    if (!isValid) throw new Error('Language Picker - _backgroundStyles._backgroundPosition property');
    return true;
  });

  updatePlugin('Language Picker - update to 5.7.0', { name: 'adapt-contrib-languagePicker', version: '5.7.0', framework: '>=5.30.2' });

  testSuccessWhere('languagePicker with existing config', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.6.0' }],
    content: [
      { _type: 'config', _languagePicker: { _isEnabled: true, title: 'Language selection' } },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('languagePicker with minimal config', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.6.0' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course' }
    ]
  });

  testStopWhere('languagePicker with empty config', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.6.0' }],
    content: [
      { _type: 'config' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '5.7.0' }],
    content: [
      { _type: 'config' }
    ]
  });
});
