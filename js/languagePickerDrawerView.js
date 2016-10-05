define([
    'core/js/adapt',
    'backbone'
], function(Adapt, Backbone) {
    
    var LanguagePickerDrawerView = Backbone.View.extend({
        
        events: {
            'click button': 'onButtonClick'
        },
        
        initialize: function () {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(Adapt, 'languagepicker:changelanguage:yes', this.onDoChangeLanguage);
            this.listenTo(Adapt, 'languagepicker:changelanguage:no', this.onDontChangeLanguage);
            this.render();
        },
        
        render: function () {
            var data = this.model.toJSON();
            var template = Handlebars.templates[this.constructor.template];
            this.$el.html(template(data));
        },
        
        onButtonClick: function (event) {
            var newLanguage = $(event.target).attr('data-language');
            this.model.set('newLanguage', newLanguage);
            var data = this.model.getLanguageDetails(newLanguage);
            
            var promptObject = {
                _classes: "dir-ltr",
                title: data.warningTitle,
                body: data.warningMessage,
                _prompts:[
                    {
                        promptText: data._buttons.yes,
                        _callbackEvent: "languagepicker:changelanguage:yes"
                    },
                    {
                        promptText: data._buttons.no,
                        _callbackEvent: "languagepicker:changelanguage:no"
                    }
                ],
                _showIcon: true
            };

            if (data._direction === 'rtl') {
                promptObject._classes = "dir-rtl";
            }
            
            //keep active element incase the user cancels - usually navigation bar icon
            this.$finishFocus = $.a11y.state.focusStack.pop();
            //move drawer close focus to #focuser
            $.a11y.state.focusStack.push($("#focuser"));

            Adapt.once('drawer:closed', function() {
                //wait for drawer to fully close
                _.delay(function(){
                    //show yes/no popup
                    Adapt.once('popup:opened', function() {
                        //move popup close focus to #focuser
                        $.a11y.state.focusStack.pop();
                        $.a11y.state.focusStack.push($("#focuser"));
                    });

                    Adapt.trigger('notify:prompt', promptObject);
                }, 250);
            });

            Adapt.trigger('drawer:closeDrawer');
        },
        
        onDoChangeLanguage: function () {
            // set default languge
            var newLanguage = this.model.get('newLanguage');
            this.model.setLanguage(newLanguage);
            this.remove();
        },
        
        onDontChangeLanguage: function () {
            this.remove();

            //wait for notify to close fully
            _.delay(_.bind(function(){
                //focus on navigation bar icon
                this.$finishFocus.a11y_focus();
            }, this), 500);

        }
        
    }, {
        template: 'languagePickerDrawerView'
    });

    return LanguagePickerDrawerView;

});
