import Adapt from 'core/js/adapt';
import offlineStorage from 'core/js/offlineStorage';
import LanguagePickerView from './languagePickerView';
import LanguagePickerNavView from './languagePickerNavView';
import LanguagePickerModel from './languagePickerModel';

class LanguagePicker extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'configModel:dataLoaded', this.onConfigLoaded);
  }

  /**
   * Once the Adapt config has loaded, check to see if the language picker is enabled. If it is:
   * - stop the rest of the .json from loading
   * - set up the language picker model
   * - register for events to allow us to display the language picker icon in the navbar on pages and menus
   * - wait for offline storage to be ready so that we can check to see if there's a stored language choice or not
   */
  onConfigLoaded() {
    const config = Adapt.config.get('_languagePicker');
    if (!config?._isEnabled) return;

    this.languagePickerModel = new LanguagePickerModel(config);

    this.listenTo(Adapt, 'router:menu router:page', this.setupNavigationView);

    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang');

    if (paramLang && Adapt.build.get('availableLanguageNames').includes(paramLang)) return;

    Adapt.config.set('_canLoadData', false);

    if (offlineStorage.ready) { // on the offchance that it may already be ready...
      this.onOfflineStorageReady();
      return;
    }

    this.listenToOnce(Adapt, 'offlineStorage:ready', this.onOfflineStorageReady);
  }

  /**
   * Once offline storage is ready, check to see if a language was previously selected by the user
   * If it was, load it. If it wasn't, show the language picker
   */
  async onOfflineStorageReady() {
    await Adapt.wait.queue();
    const storedLanguage = offlineStorage.get('lang');

    if (storedLanguage) {
      this.languagePickerModel.setLanguage(storedLanguage, { canReset: false });
      return;
    }

    if (this.languagePickerModel.get('_showOnCourseLoad') === false) {
      this.languagePickerModel.setLanguage(Adapt.config.get('_defaultLanguage'), { canReset: false });
      return;
    }

    this.showLanguagePickerView();
  }

  showLanguagePickerView() {
    const languagePickerView = new LanguagePickerView({
      model: this.languagePickerModel
    });

    languagePickerView.$el.appendTo('#wrapper');
  }

  setupNavigationView() {
    /*
      * On the framework this isn't an issue, but courses built in the authoring tool before the ARIA label
      * was added will break unless the extension is removed then added again.
      */
    const courseGlobals = Adapt.course.get('_globals')._extensions;
    let navigationBarLabel = '';
    if (courseGlobals._languagePicker) {
      navigationBarLabel = courseGlobals._languagePicker.navigationBarLabel;
    }

    const languagePickerNavView = new LanguagePickerNavView({
      model: this.languagePickerModel,
      attributes: {
        'aria-label': navigationBarLabel
      }
    });

    languagePickerNavView.$el.appendTo('.nav__inner');
  }
}

export default new LanguagePicker();
