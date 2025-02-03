import { describe, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Language Picker - v1.0.8 to v2.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v1.0.8..v2.0.0

  let config;
  const ariaLabels = {
    navigation: 'A short description of the course navigation bar.'
  };

  whereFromPlugin('Language Picker - from v1.0.8', { name: 'adapt-contrib-languagePicker', version: '<2.0.0' });

  whereContent('Language Picker is configured', content => {
    config = getConfig(content);
    return config._languagePicker;
  });

  mutateContent('Language Picker - add attribute _classes', async (content) => {
    if (!_.has(config._languagePicker, '_accessibility')) _.set(config._languagePicker, '_accessibility', {});
    config._languagePicker._accessibility._ariaLabels = ariaLabels;
    return true;
  });

  checkContent('Language Picker - check attribute _classes', async (content) => {
    return getConfig(content)._languagePicker._accessibility._ariaLabels === ariaLabels;
  });

  updatePlugin('Language Picker - update to v2.0.0', { name: 'adapt-contrib-languagePicker', version: '2.0.0', framework: '">=3' });
});
