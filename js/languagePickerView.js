import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y';
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
    return [
      'languagepicker',
      this.setBackgroundImage() && 'has-bg-image'
    ].filter(Boolean).join(' ');
  }

  initialize() {
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

    super.remove();
  }

}
