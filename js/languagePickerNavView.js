import Adapt from 'core/js/adapt';
import LanguagePickerDrawerView from './languagePickerDrawerView';

export default class LanguagePickerNavView extends Backbone.View {

  tagName() {
    return 'button';
  }

  className() {
    const classNames = 'btn-icon nav__btn nav__languagepicker-btn js-languagepicker-nav-btn icon';
    const customClass = this.model.get('_languagePickerIconClass') || 'icon-language-2';

    return `${classNames} ${customClass}`;
  }

  events() {
    return {
      click: 'onClick'
    };
  }

  initialize() {
    this.listenTo(Adapt, 'remove', this.remove);
  }

  onClick(event) {
    Adapt.drawer.triggerCustomView(new LanguagePickerDrawerView({ model: this.model }).$el, false);
  }

}
