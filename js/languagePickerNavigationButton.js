import Adapt from 'core/js/adapt';
import drawer from 'core/js/drawer';
import NavigationButtonView from 'core/js/views/NavigationButtonView';
import tooltips from 'core/js/tooltips';
import LanguagePickerDrawerView from './languagePickerDrawerView';

export default class LanguagePickerNavigationButton extends NavigationButtonView {

  attributes() {
    const attributes = super.attributes();
    return Object.assign(attributes, {
      'data-tooltip-id': 'languagepicker'
    });
  }

  static get template() {
    return 'languagePickerNavigationButton.jsx';
  }

  events() {
    return {
      click: 'onClick'
    };
  }

  initialize(options) {
    super.initialize(options);
    this.drawerModel = options.drawerModel;
    this.setupEventListeners();
    tooltips.register({
      _id: 'languagepicker',
      ...this.model.get('_navTooltip')
    });
  }

  setupEventListeners() {
    this.listenTo(Adapt, {
      remove: this.remove
    });
  }

  onClick(event) {
    drawer.openCustomView(new LanguagePickerDrawerView({ model: this.drawerModel }).$el, false, this.model.get('_drawerPosition'));
  }

}
