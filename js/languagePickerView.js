define([
  'core/js/adapt',
  './accessibilityView'
], function(Adapt, accessibilityView) {
  
  var LanguagePickerView = Backbone.View.extend({
    
    events: {
      'click .languagepicker-languages button': 'onLanguageClick'
    },
    
    className: 'languagepicker',
    
    initialize: function () {
      this.initializeAccessibility();

      this.listenTo(Adapt, 'remove', this.remove);
      this.render();
    },
    
    render: function () {
      var data = this.model.toJSON();
      var template = Handlebars.templates[this.constructor.template];
      this.$el.html(template(data));
      
      _.defer(_.bind(function () {
        this.postRender();
      }, this));
    },
    
    postRender: function () {
      $('.loading').hide();
    },
    
    onLanguageClick: function (event) {
      this.destroyAccessibility();
      this.model.setLanguage($(event.target).val());
    },


    initializeAccessibility: function() {
      $("html").addClass("in-languagepicker");

      this.accessibilityView = new accessibilityView({
        model:this.model
      });
    },

    destroyAccessibility: function() {
      $("html").removeClass("in-languagepicker");

      this.accessibilityView.remove();
    }
    
  }, {
    template: 'languagePickerView'
  });

  return LanguagePickerView;

});
