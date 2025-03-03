import { describe, getCourse, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Language Picker - v1.0.0 to v1.0.3', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v1.0.0..v1.0.3

  let course, config, courseLanguagePickerGlobals;

  whereFromPlugin('Language Picker - from v1.0.0', { name: 'adapt-contrib-languagePicker', version: '<1.0.3' });

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

  mutateContent('Language Picker - add new globals', async (content) => {
    courseLanguagePickerGlobals.navigationBarLabel = 'Select course language';
    return true;
  });

  mutateContent('Language Picker - add attribute _classes', async (content) => {
    config._languagePicker._classes = '';
    return true;
  });

  checkContent('Language Picker - check new globals', async (content) => {
    const isValid = courseLanguagePickerGlobals.navigationBarLabel === 'Select course language';
    if (!isValid) throw new Error('Language Picker - global attribute navigationBarLabel');
    return true;
  });

  checkContent('Language Picker - check attribute _classes', async (content) => {
    const isValid = getConfig(content)._languagePicker._classes === '';
    if (!isValid) throw new Error('Language Picker - config attribute _classes');
    return true;
  });

  updatePlugin('Language Picker - update to v1.0.3', { name: 'adapt-contrib-languagePicker', version: '1.0.3', framework: '">=2.0.14' });

  testSuccessWhere('languagePicker with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.0' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('languagePicker with no _type and empty course', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.0' }],
    content: [
      { __path__: 'src/course/config.json', _languagePicker: {} },
      { _type: 'course' }
    ]
  });

  testStopWhere('languagePicker with course globals', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.0' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course', _languagePicker: {}, _globals: { _extensions: { _languagePicker: {} } } }
    ]
  });

  testStopWhere('languagePicker with empty config', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.0' }],
    content: [
      { _type: 'config' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.3' }]
  });
});
