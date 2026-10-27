import Adapt from 'core/js/adapt';
import { templates } from 'core/js/reactHelpers';
import React from 'react';
import ReactDOM from 'react-dom';

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
    this.template = 'languagePickerNavigation.jsx';
    this.preRender();
  }

  preRender() {
    Adapt.trigger('navigationView:preRender', this);
    this.render();
  }

  render() {
    const Template = templates[this.template.replace('.jsx', '')];
    ReactDOM.render(<Template />, this.el);
    this.$el.insertBefore('#app');

    _.defer(() => Adapt.trigger('navigationView:postRender', this));

    return this;
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    super.remove();
  }

}
