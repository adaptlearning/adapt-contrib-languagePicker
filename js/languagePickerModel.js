define([
    'coreJS/adapt',
    'backbone',
    'coreJS/adaptCollection',
    'coreModels/courseModel',
    'coreModels/contentObjectModel',
    'coreModels/articleModel',
    'coreModels/blockModel',
    'coreModels/componentModel',
    'coreModels/questionModel'
], function (Adapt, Backbone, AdaptCollection, CourseModel, ContentObjectModel, ArticleModel, BlockModel, ComponentModel, QuestionModel) {
  
  var LanguagePickerModel = Backbone.Model.extend({
    
    defaults: {
      "_isEnabled": false,
      "displayTitle": "",
      "body": "",
      "_languages": [],
      "_defaultLanguage": "en",
      "_defaultDirection": "ltr"
    },
    
    initialize: function () {
      this.listenTo(Adapt.config, 'change:_defaultLanguage', this.onConfigChange);
      
      this.set('_defaultLanguage', Adapt.config.get('_defaultLanguage'));
      this.set('_defaultDirection', Adapt.config.get('_defaultDirection'));
    },

    getLanguageDetails: function (language) {
      var _languages = this.get('_languages');
      return _.find(_languages, function (item) {
        return item._language == language
      });
    },

    setDefaultLanguage: function (language) {
      var langData = this.getLanguageDetails(language);
      var direction = langData._direction;
      Adapt.config.set('_defaultLanguage', language);
      Adapt.config.set('_defaultDirection', direction);
      Adapt.offlineStorage.set("lang", language);
      $('html').attr('lang', language);
      if (direction === 'rtl') {
        $('html').removeClass('dir-ltr').addClass('dir-rtl');
      } else {
        $('html').removeClass('dir-rtl').addClass('dir-ltr');
      }
    },
    
    onConfigChange: function (model, value, options) {
      this.set('_defaultLanguage', value);
    },
    
    reloadCourseData: function () {
      Adapt.on('adaptCollection:dataLoaded courseModel:dataLoaded', this.checkDataIsLoaded);
      Adapt.loadCourseData();
    },
    
    checkDataIsLoaded: function () {
      if (!(Adapt.contentObjects.models.length > 0 && Adapt.articles.models.length > 0 && Adapt.blocks.models.length > 0 && Adapt.components.models.length > 0)) {
        return;
      }

      Adapt.mapAdaptIdsToObjects();

      Adapt.trigger('app:resetSession');
      
      _.defer(function() {
        Backbone.history.navigate('#/', {trigger: true, replace: true});
      });
    }
    
  });
  
  return LanguagePickerModel;
  
});
