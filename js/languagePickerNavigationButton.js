import Adapt from 'core/js/adapt';
import drawer from 'core/js/drawer';
import NavigationButtonView from 'core/js/views/NavigationButtonView';
import tooltips from 'core/js/tooltips';
import LanguagePickerDrawerView from './languagePickerDrawerView';

export default class LanguagePickerNavigationButton extends NavigationButtonView {

  attributes() {
    return {
      ...super.attributes(),
      'data-tooltip-id': this.model.get('_id')
    };
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
      _id: this.model.get('_id'),
      ...this.model.get('_navTooltip')
    });
  }

  setupEventListeners() {
    this.listenTo(Adapt, {
      remove: this.remove
    });
  }

  static get template() {
    return 'languagePickerNavigationButton.jsx';
  }

  onClick(event) {
    drawer.openCustomView(new LanguagePickerDrawerView({ model: this.drawerModel }).$el, false, this.model.get('_drawerPosition'));
  }

}
