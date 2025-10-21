import { describe, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Language Picker - v1.0.8 to v2.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v1.0.8..v2.0.0

  let config;
  const ariaLabels = {
    navigation: 'A short description of the course navigation bar.'
  };

  whereFromPlugin('Language Picker - from v1.0.8', { name: 'adapt-contrib-languagePicker', version: '<2.0.0' });

  whereContent('Language Picker is configured', content => {
    config = getConfig();
    return config._languagePicker;
  });

  mutateContent('Language Picker - add attribute _classes', async (content) => {
    if (!_.has(config._languagePicker, '_accessibility')) _.set(config._languagePicker, '_accessibility._ariaLabels', ariaLabels);
    config._languagePicker._accessibility._ariaLabels = ariaLabels;
    return true;
  });

  checkContent('Language Picker - check attribute _classes', async (content) => {
    const isValid = _.isEqual(getConfig()._languagePicker._accessibility._ariaLabels, ariaLabels);
    if (!isValid) throw new Error('Language Picker - config attribute _ariaLabels');
    return true;
  });

  updatePlugin('Language Picker - update to v2.0.0', { name: 'adapt-contrib-languagePicker', version: '2.0.0', framework: '">=3' });

  testSuccessWhere('languagePicker with no _accessibility', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.8' }],
    content: [
      { _type: 'config', _languagePicker: {} }
    ]
  });

  testSuccessWhere('languagePicker with _accessibility', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.8' }],
    content: [
      { _type: 'config', _languagePicker: { _accessibility: {} } }
    ]
  });

  testSuccessWhere('languagePicker with no _type and empty course', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.8' }],
    content: [
      { _type: 'config', _languagePicker: {} },
      { _type: 'course' }
    ]
  });

  testStopWhere('languagePicker with empty config', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '1.0.8' }],
    content: [
      { _type: 'config' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-languagePicker', version: '2.0.0' }],
    content: [
      { _type: 'config' }
    ]
  });
});
