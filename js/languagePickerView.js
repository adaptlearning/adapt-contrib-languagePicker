import Adapt from 'core/js/adapt';
import NavigationView from './languagePickerNavigationView';
import device from 'core/js/device';
import router from 'core/js/router';
import { templates } from 'core/js/reactHelpers';
import React from 'react';
import ReactDOM from 'react-dom';

class LanguagePickerView extends Backbone.View {

  className() {
    return [
      'languagepicker',
      this.setBackgroundImage() && 'has-bg-image'
    ].filter(Boolean).join(' ');
  }

  initialize() {
    _.bindAll(this, 'onLanguageClick');
    this.initializeNavigation();
    $('html').addClass('in-languagepicker');
    this.addEventListeners();
    this.setBackgroundImage();
    this.setBackgroundStyles();
    this.render();
  }

  addEventListeners() {
    this.onScreenSizeChanged = _.debounce(this.onScreenSizeChanged.bind(this), 300);
    this.listenTo(Adapt, {
      remove: this.remove,
      'device:resize': this.onScreenSizeChanged
    });
  }

  render() {
    const data = this.model.toJSON();
    const props = {
      ...data,
      onLanguageClick: this.onLanguageClick
    };
    const Template = templates[this.constructor.template.replace('.jsx', '')];
    ReactDOM.render(<Template {...props} />, this.el);
    this.$el.addClass(data._classes);

    document.title = this.model.get('title') || '';

    _.defer(this.postRender.bind(this));
  }

  postRender() {
    router.hideLoading();
  }

  onLanguageClick(event) {
  if (this._isLanguageChanging) return;
  this._isLanguageChanging = true;
    this.destroyNavigation();
    const lang = event.currentTarget.value;
    this.model.setLanguage(lang);
  }

  initializeNavigation() {
    this.navigationView = new NavigationView({ model: this.model });
  }

  destroyNavigation() {
    this.navigationView.remove();
  }

  onScreenSizeChanged() {
    this.setBackgroundImage();
    this.render();
  }

  setBackgroundImage() {
    const backgroundImages = this.model.get('_backgroundImage');
    if (!backgroundImages) return;

    const backgroundImage = backgroundImages?.[`_${device.screenSize}`] ?? backgroundImages?._small;
    this.model.set('backgroundImage', backgroundImage);

    return backgroundImage;
  }

  setBackgroundStyles() {
    const styles = this.model.get('_backgroundStyles');
    if (!styles || !this.model.get('backgroundImage')) return;

    const backgroundStyles = Object.entries({
      'background-repeat': styles._backgroundRepeat,
      'background-size': styles._backgroundSize,
      'background-position': styles._backgroundPosition
    }).map(([style, value]) => `${style}: ${value}`)
      .join('; ');

    this.model.set('backgroundStyles', backgroundStyles);
  }

  remove() {
    $('html').removeClass('in-languagepicker');
    ReactDOM.unmountComponentAtNode(this.el);

    super.remove();
  }

}

LanguagePickerView.template = 'languagePickerView.jsx';

export default LanguagePickerView;
