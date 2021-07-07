define([
  'core/js/adapt',
  './languagePickerNavigationView'
], function(Adapt, NavigationView) {

  class LanguagePickerView extends Backbone.View {
    
    get template() {
      return 'languagePickerView';
    }

    events() {
      return {
        'click .js-languagepicker-btn-click': 'onLanguageClick'
      };
    }

    className(){
      return 'languagepicker';
    }

    initialize() {
      this.initializeNavigation();
      $('html').addClass('in-languagepicker');
      this.listenTo(Adapt, 'remove', this.remove);
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
      $('.js-loading').hide();
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

    remove() {
      $('html').removeClass('in-languagepicker');

      Backbone.View.prototype.remove.apply(this, arguments);
    }

  };

  return LanguagePickerView;

});
