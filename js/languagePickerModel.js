define([
    'core/js/adapt',
    'backbone'
], function (Adapt, Backbone) {
  
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
        return (item._language == language);
      });
    },

    setDefaultLanguage: function (language) {
      Adapt.config.set({
        '_defaultLanguage': language,
        '_defaultDirection': this.getLanguageDetails(language)._direction
      });
    },
    
    onConfigChange: function (model, value, options) {
      this.set('_defaultLanguage', value);
      this.markLanguageAsSelected(value);
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

      this.set('_languages', languages);
    },
    
  });
  
  return LanguagePickerModel;
  
});
