define([
  'core/js/adapt'
], function(Adapt) {

  var NavigationView = Backbone.View.extend({

    className: 'nav',

    attributes: {
      role: 'navigation'
    },

    initialize: function() {
      this.template = 'languagePickerNavigation';
      this.setupHelpers();
      this.preRender();
    },

    preRender: function() {
      Adapt.trigger('navigationView:preRender', this);
      this.render();
    },

    render: function() {
      const template = Handlebars.templates[this.template];
      this.$el.html(template({
        _config: this.model.get('_accessibility'),
        _accessibility: Adapt.config.get('_accessibility')
      })).insertBefore('#app');

      _.defer(() => Adapt.trigger('navigationView:postRender', this));

      return this;
    },

    setupHelpers: function() {
      Handlebars.registerHelper('a11y_aria_label', function(text) {
        return `<div class="aria-label">${text}</div>`;
      });
    }

  });

  return NavigationView;

});
