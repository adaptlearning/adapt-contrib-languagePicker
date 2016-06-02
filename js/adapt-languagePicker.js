define([
  'coreJS/adapt',
  'backbone',
  './languagePickerView',
  './languagePickerNavView',
  './languagePickerModel'
], function(Adapt, Backbone, LanguagePickerView, LanguagePickerNavView, LanguagePickerModel) {

  var languagePickerModel;

  Adapt.once('configModel:dataLoaded', onConfigLoaded);

  function onConfigLoaded() {
      if (!Adapt.config.has('_languagePicker')) return;
      if (!Adapt.config.get('_languagePicker')._isEnabled) return;
    
      // stop default language loading
      Adapt.config.set("_canLoadData", false);
      languagePickerModel = new LanguagePickerModel(Adapt.config.get('_languagePicker'));
      
      Adapt.on('router:page', setupNavigationView);
      Adapt.on('router:menu', setupNavigationView);
      
      // wait for spoor to initialize on the configModel:dataLoaded event
      _.defer(onSpoorInitialized);
  }

  function onSpoorInitialized() {
      // see if a language was previously saved
      var previousLanguage = Adapt.offlineStorage.get("lang");
      if (!previousLanguage) {
        // ask user for lanugage if non specified
        showLanguagePickerView();
      } else {
        // set config default language
        languagePickerModel.setDefaultLanguage(previousLanguage);
        loadLanguage();
      }
  }

  function showLanguagePickerView () {
      var languagePickerView = new LanguagePickerView({
        model: languagePickerModel
      });
      
      languagePickerView.$el.appendTo('#wrapper');
  }

  function loadLanguage () {
      // continue loading course
      Adapt.trigger('configModel:loadCourseData');
  }
  
  function setupNavigationView () {
    var languagePickerNavView = new LanguagePickerNavView({
      model: languagePickerModel
    });
    
    languagePickerNavView.$el.appendTo('.navigation-inner');
  }
  
});
