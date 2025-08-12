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
