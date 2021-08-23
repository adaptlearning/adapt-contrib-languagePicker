import Adapt from 'core/js/adapt';

export default class NavigationView extends Backbone.View {

  className() {
    return 'nav';
  }

  attributes() {
    return {
      role: 'navigation'
    };
  }

  initialize() {
    this.template = 'languagePickerNavigation';
    this.setupHelpers();
    this.preRender();
  }

  preRender() {
    Adapt.trigger('navigationView:preRender', this);
    this.render();
  }

  render() {
    const template = Handlebars.templates[this.template];
    this.$el.html(template({
      _config: this.model.get('_accessibility'),
      _accessibility: Adapt.config.get('_accessibility')
    })).insertBefore('#app');

    _.defer(() => Adapt.trigger('navigationView:postRender', this));

    return this;
  }

  setupHelpers() {
    Handlebars.registerHelper('a11y_aria_label', text => {
      return `<div class="aria-label">${text}</div>`;
    });
  }

}
