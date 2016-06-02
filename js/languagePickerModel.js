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
      var language = Adapt.config.get('_defaultLanguage');
      var courseFolder = "course/" + language +"/";
      
      Adapt.on('adaptCollection:dataLoaded courseModel:dataLoaded', this.checkDataIsLoaded);
      
      Adapt.course = new CourseModel(null, {url:courseFolder + "course.json", reset:true});
      
      Adapt.contentObjects = new AdaptCollection(null, {
          model: ContentObjectModel,
          url: courseFolder +"contentObjects.json"
      });
      
      Adapt.articles = new AdaptCollection(null, {
          model: ArticleModel,
          url: courseFolder + "articles.json"
      });
      
      Adapt.blocks = new AdaptCollection(null, {
          model: BlockModel,
          url: courseFolder + "blocks.json"
      });

      Adapt.components = new AdaptCollection(null, {
          model: function(json) {
              //use view+model object
              var ViewModelObject = Adapt.componentStore[json._component];

              if(!ViewModelObject) {
                  throw new Error(json._component + ' component not found. Is it installed and included?');
              }

              //if model defined for component use component model
              if (ViewModelObject.model) {
                  return new ViewModelObject.model(json);
              }

              var View = ViewModelObject.view || ViewModelObject;
              //if question type use question model
              if (View._isQuestionType) {
                  return new QuestionModel(json);
              }

              //otherwise use component model
              return new ComponentModel(json);
          },
          url: courseFolder + "components.json"
      });
      
    },
    
    checkDataIsLoaded: function () {
      if (Adapt.contentObjects.models.length > 0 && Adapt.articles.models.length > 0 && Adapt.blocks.models.length > 0 && Adapt.components.models.length > 0) {
        
        // setup Models
        Adapt.contentObjects.each(function (model) {
          model.setupModel();
        });
        Adapt.articles.each(function (model) {
          model.setupModel();
        });
        Adapt.blocks.each(function (model) {
          model.setupModel();
        });
        Adapt.components.each(function (model) {
          model.setupModel();
        });
        
        Adapt.resetMapping();
        Adapt.setupMapping();
        
        // mapAdaptIdsToObjects
        Adapt.contentObjects._byAdaptID = Adapt.contentObjects.groupBy("_id");
        Adapt.articles._byAdaptID = Adapt.articles.groupBy("_id");
        Adapt.blocks._byAdaptID = Adapt.blocks.groupBy("_id");
        Adapt.components._byAdaptID = Adapt.components.groupBy("_id");
        
        Adapt.trigger('app:dataReady'); // required for Assesment to call register
        // trigger event to reset session in adapt-stateful-session
        Adapt.trigger('app:resetSession');
        
        // navigate home
        Backbone.history.navigate('#/', {trigger: true, replace: true});
      }
    }
    
  });
  
  return LanguagePickerModel;
  
});
