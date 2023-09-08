import Adapt from 'core/js/adapt';
import drawer from 'core/js/drawer';
import LanguagePickerDrawerView from './languagePickerDrawerView';
import tooltips from 'core/js/tooltips';

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
    this.listenTo(Adapt, {
      remove: this.remove,
      'drawer:closed': this.onClose
    });

    tooltips.register({
      _id: 'languagePicker',
      ...Adapt.course.get('_globals')?._extensions?._languagePicker?._navTooltip || {}
    });
  }

  onClose() {
    this.$el.attr('aria-expanded', false);
  }

  onClick(event) {
    this.$el.attr('aria-expanded', true);
    drawer.triggerCustomView(new LanguagePickerDrawerView({ model: this.model }).$el, false);
  }

}
