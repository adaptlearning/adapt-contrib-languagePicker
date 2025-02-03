import { describe, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

const getCourse = content => {
  const [course] = content.filter(({ _type }) => _type === 'course');
  return course;
};

const getGlobals = content => {
  return getCourse(content)?._globals?._extensions?._languagePicker;
};

describe('Language Picker - v2.0.0 to v3.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v2.0.0..v3.0.0

  let config, course, courseLanguagePickerGlobals;

  whereFromPlugin('Language Picker - from v2.0.0', { name: 'adapt-contrib-languagePicker', version: '<3.0.0' });

  whereContent('Language Picker is configured', content => {
    config = getConfig(content);
    return config._languagePicker;
  });

  mutateContent('Language Picker - add globals if missing', async (content) => {
    course = getCourse(content);
    if (!_.has(course, '_globals._extensions._languagePicker')) _.set(course, '_globals._extensions._languagePicker', {});
    courseLanguagePickerGlobals = course._globals._extensions._languagePicker;
    return true;
  });

  mutateContent('Language Picker - add new globals', async (content) => {
    courseLanguagePickerGlobals.languageSelector = 'Language selector';
    return true;
  });

  mutateContent('Language Picker - add attribute _restoreStateOnLanguageChange', async (content) => {
    config._languagePicker._restoreStateOnLanguageChange = false;
    return true;
  });

  mutateContent('Language Picker - remove attribute _accessibility', async (content) => {
    delete config._languagePicker._accessibility;
    return true;
  });

  checkContent('Language Picker - check new globals', async (content) => {
    return getGlobals(content).languageSelector === 'Language selector';
  });

  checkContent('Language Picker - check attribute _restoreStateOnLanguageChange', async (content) => {
    return getConfig(content)._languagePicker._restoreStateOnLanguageChange === false;
  });

  checkContent('Language Picker - check attribute _accessibility', async (content) => {
    return !_.has(getConfig(content)._languagePicker, '_accessibility');
  });

  updatePlugin('Language Picker - update to v3.0.0', { name: 'adapt-contrib-languagePicker', version: '3.0.0', framework: '">=4' });
});
