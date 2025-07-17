import Adapt from 'core/js/adapt';
import NavigationView from './languagePickerNavigationView';
import device from 'core/js/device';
import router from 'core/js/router';

export default class LanguagePickerView extends Backbone.View {

  get template() {
    return 'languagePickerView';
  }

  events() {
    return {
      'click .js-languagepicker-btn-click': 'onLanguageClick'
    };
  }

  className() {
    const backgroundImages = this.model.get('_backgroundImage');
    const backgroundImage = backgroundImages?.[`_${device.screenSize}`] ?? backgroundImages?._small;

    return [
      'languagepicker',
      backgroundImage && 'has-bg-image'
    ].filter(Boolean).join(' ');
  }

  initialize() {
    _.bindAll(this, 'onScreenSizeChanged');
    this.initializeNavigation();
    $('html').addClass('in-languagepicker');
    this.listenTo(Adapt, {
      remove: this.remove,
      'device:resize': this.onScreenSizeChanged
    });
    this.setBackgroundImage();
    this.setBackgroundStyles();
    this.render();
  }

  render() {
    const data = this.model.toJSON();
    const template = Handlebars.templates[this.template];
    this.$el.html(template(data));
    this.$el.addClass(data._classes);

    document.title = this.model.get('title') || '';

    _.defer(this.postRender.bind(this));
  }

  postRender() {
    router.hideLoading();
  }

  onLanguageClick(event) {
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
    _.defer(this.render.bind(this));
  }

  setBackgroundImage() {
    const backgroundImages = this.model.get('_backgroundImage');
    if (!backgroundImages) return;

    const backgroundImage = backgroundImages?.[`_${device.screenSize}`] ?? backgroundImages?._small;
    this.model.set('backgroundImage', backgroundImage);
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

    super.remove();
  }

}
