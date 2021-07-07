define([
  'core/js/adapt'
], function(Adapt) {

  class LanguagePickerDrawerView extends Backbone.View {
    
    get template() {
      return 'languagePickerDrawerView';
    }

    events() {
      return {
        'click .js-languagepicker-item-btn': 'onButtonClick'
      };
    }

    initialize() {
      this.listenTo(Adapt, {
        remove: this.remove,
        'languagepicker:changelanguage:yes': this.onDoChangeLanguage,
        'languagepicker:changelanguage:no': this.onDontChangeLanguage
      });
      this.render();
    }

    render() {
      const data = this.model.toJSON();
      const template = Handlebars.templates[this.template];
      this.$el.html(template(data));
    }

    onButtonClick(event) {
      const newLanguage = $(event.currentTarget).attr('data-language');
      this.model.set('newLanguage', newLanguage);
      const data = this.model.getLanguageDetails(newLanguage);

      const promptObject = {
        _attributes: { lang: newLanguage },
        _classes: `is-lang-${newLanguage} ${data._direction === 'rtl' ? 'is-rtl' : 'is-ltr'}`,
        title: data.warningTitle,
        body: data.warningMessage,
        _prompts: [
          {
            promptText: data._buttons.yes,
            _callbackEvent: 'languagepicker:changelanguage:yes'
          },
          {
            promptText: data._buttons.no,
            _callbackEvent: 'languagepicker:changelanguage:no'
          }
        ],
        _showIcon: true
      };

      // keep active element incase the user cancels - usually navigation bar icon
      // move drawer close focus to #focuser
      this.$finishFocus = Adapt.a11y._popup._focusStack.pop();
      Adapt.a11y._popup._focusStack.push($('#a11y-focuser'));

      Adapt.once('drawer:closed', () => {
        // wait for drawer to fully close
        _.delay(() => {
          Adapt.once('popup:opened', () => {
            // move popup close focus to #focuser
            Adapt.a11y._popup._focusStack.pop();
            Adapt.a11y._popup._focusStack.push($('#a11y-focuser'));
          });
          // show yes/no popup
          Adapt.notify.prompt(promptObject);
        }, 250);
      });

      Adapt.trigger('drawer:closeDrawer');
    }

    onDoChangeLanguage() {
      const newLanguage = this.model.get('newLanguage');
      this.model.setTrackedData();
      this.model.setLanguage(newLanguage);
      this.remove();
    }

    /**
     * If the learner selects 'no' in the 'confirm language change' prompt,
     * wait for notify to close completely then send focus to the
     * navigation bar icon
     */
    onDontChangeLanguage() {
      this.remove();

      _.delay(() => Adapt.a11y.focusFirst(this.$finishFocus), 500);

    }

  };

  return LanguagePickerDrawerView;

});
