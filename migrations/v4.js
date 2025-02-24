import { describe, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';

describe('Language Picker - v4.1.2 to v4.2.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v4.1.2..v4.2.0

  let config;

  whereFromPlugin('Language Picker - from v4.1.2', { name: 'adapt-contrib-languagePicker', version: '<4.2.0' });

  whereContent('Language Picker is configured', content => {
    config = getConfig();
    return config._languagePicker?._languages?.length;
  });

  mutateContent('Language Picker - add attribute _isDisabled', async (content) => {
    config._languagePicker._languages.forEach(item => (item._isDisabled = false));
    return true;
  });

  checkContent('Language Picker - check attribute _isDisabled', async (content) => {
    const isValid = config._languagePicker._languages.every(item => item._isDisabled === false);
    if (!isValid) throw new Error('Language Picker - item attribute _isDisabled');
    return true;
  });

  updatePlugin('Language Picker - update to v4.2.0', { name: 'adapt-contrib-languagePicker', version: '4.2.0', framework: '">=5.6' });
});
