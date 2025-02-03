import { describe, getConfig, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

const getCourse = content => {
  const [course] = content.filter(({ _type }) => _type === 'course');
  return course;
};

describe('Language Picker - v5.3.0 to v5.4.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-languagePicker/compare/v5.3.0..v5.4.0

  let course, config, courseLanguagePickerGlobals;
  const navTooltip = {
    _isEnabled: true,
    text: 'Select course language'
  };

  whereFromPlugin('Language Picker - from v5.3.0', { name: 'adapt-contrib-languagePicker', version: '<5.4.0' });

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
    return courseLanguagePickerGlobals._navOrder === 0;
  });

  checkContent('Language Picker - check attribute _navTooltip', async (content) => {
    return courseLanguagePickerGlobals._navTooltip === navTooltip;
  });

  checkContent('Language Picker - check attribute _showLabel', async (content) => {
    return courseLanguagePickerGlobals._showLabel === true;
  });

  checkContent('Language Picker - check attribute _drawerPosition', async (content) => {
    return courseLanguagePickerGlobals._drawerPosition === 'auto';
  });

  updatePlugin('Language Picker - update to v5.4.0', { name: 'adapt-contrib-languagePicker', version: '5.4.0', framework: '">=5.30.2' });
});
