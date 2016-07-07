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

      this.markLanguageAsSelected(Adapt.config.get('_defaultLanguage'));
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
      var storedLanguage = Adapt.offlineStorage.get('lang');

      Adapt.config.set('_defaultLanguage', language);
      Adapt.config.set('_defaultDirection', direction);
      
      if (storedLanguage !== language || !storedLanguage) {
        Adapt.offlineStorage.set("lang", language);
      }
      
      $('html').attr('lang', language);
      if (direction === 'rtl') {
        $('html').removeClass('dir-ltr').addClass('dir-rtl');
      } else {
        $('html').removeClass('dir-rtl').addClass('dir-ltr');
      }
    },
    
    onConfigChange: function (model, value, options) {
      this.set('_defaultLanguage', value);
      this.markLanguageAsSelected(value);
    },
    
    reloadCourseData: function () {
      Adapt.on('adaptCollection:dataLoaded courseModel:dataLoaded', this.checkDataIsLoaded);
      Adapt.loadCourseData();
    },
    
    markLanguageAsSelected: function(language) {
      var languages = this.get('_languages');

      for (var i = 0; i < languages.length; i++) {
        if (languages[i]._language === language) {
          languages[i]._isSelected = true;
        } else {
          languages[i]._isSelected = false;
        }
      }

      this.set('_languages', languages)
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
