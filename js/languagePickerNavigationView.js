define([
    'core/js/adapt',
    './accessibilityView'
], function(Adapt, AccessibilityView) {

    var NavigationView = Backbone.View.extend({

        className: "navigation",

        initialize: function() {
            /*this.listenToOnce(Adapt, 'courseModel:dataLoading', this.remove);*/
            this.listenToOnce(Adapt, 'accessibility:toggle', this.onA11yToggle);
            /*this.listenTo(Adapt, 'router:menu router:page', this.hideNavigationButton);*/
            this.template = "languagePickerNavigation";
            this.setupHelpers();
            this.preRender();
        },

        events: {
            'click [data-event]':'triggerEvent'
        },

        preRender: function() {
            Adapt.trigger('navigationView:preRender', this);
            this.render();
        },

        render: function() {
            var template = Handlebars.templates[this.template];
            this.$el.html(template(
                {
                    _config: this.model.get("_accessibility"),
                    _accessibility: Adapt.config.get("_accessibility")
                }
            )).insertBefore('#wrapper');

            _.defer(_.bind(function() {
                Adapt.trigger('navigationView:postRender', this);
            }, this));

            this.setupA11yButton();

            if (Adapt.accessibility.isActive()) {
                this.setupUsageInstructions();
            }

            return this;
        },

        setupHelpers: function() {
            var config = Adapt.config.get("_accessibility");

            Handlebars.registerHelper('a11y_text', function(text) {
                //ALLOW ENABLE/DISABLE OF a11y_text HELPER
                if (config && config._isTextProcessorEnabled === false) {
                    return text;
                } else {
                    return $.a11y_text(text);
                }
            });

            Handlebars.registerHelper('a11y_aria_label', function(text) {
                return '<div class="aria-label prevent-default" tabindex="0" role="region">'+text+'</div>';
            });
        },

        triggerEvent: function(event) {
            event.preventDefault();
            var currentEvent = $(event.currentTarget).attr('data-event');
            Adapt.trigger('navigation:' + currentEvent);
        },

        /*hideNavigationButton: function(model) {
            if (model.get('_type') === "course") {
                $('.navigation-back-button, .navigation-home-button').addClass('display-none');
            } else {
                this.showNavigationButton();
            }
        },

        showNavigationButton: function() {
            $('.navigation-back-button, .navigation-home-button').removeClass('display-none');
        },*/

        setupA11yButton: function() {
            new AccessibilityView({model:this.model});
        },

        setupUsageInstructions: function() {
            var config = this.model.get("_accessibility");

            if (!config || !config._accessibilityInstructions) {
                this.$('#accessibility-instructions').remove();
                return;
            }

            var instructionsList = config._accessibilityInstructions;

            var usageInstructions;
            if (instructionsList[Adapt.device.browser]) {
                usageInstructions = instructionsList[Adapt.device.browser];
            } else if (Modernizr.touch) {
                usageInstructions = instructionsList.touch || "";
            } else {
                usageInstructions = instructionsList.notouch || "";
            }

           this.$('#accessibility-instructions').html( usageInstructions );
        },

        onA11yToggle:function() {
            // listen once because if a11y active on launch instructions will already be setup
            
            if (Adapt.accessibility.isActive()) {
                this.setupUsageInstructions();
            }
        }

    });

    return NavigationView;

});


/*define([
    'core/js/adapt'
], function(Adapt) {

    var AccessibilityView = Backbone.View.extend({

        el: '#accessibility-toggle',

        events: {
            'click' : 'toggleAccessibility'
        },

        initialize: function() {
            this.setupHelpers();

            this.setupUsageInstructions();

            if(Adapt.offlineStorage.ready) {
                this.onOfflineStorageReady();
            } else {
                Adapt.once('offlineStorage:ready', _.bind(this.onOfflineStorageReady, this));
            }
        },

        onOfflineStorageReady: function() {
            Adapt.config.get("_accessibility")._isActive = Adapt.offlineStorage.get('a11y') || false;

            this.configureAccessibility();

            this.render();
        },

        render: function() {
            var hasAccessibility = Adapt.config.has('_accessibility')
                && Adapt.config.get('_accessibility')._isEnabled;

            if (!hasAccessibility) {
                return;
            } else {
                var isActive = Adapt.config.get('_accessibility')._isActive;
                var offLabel = this.model.get("_accessibility") && this.model.get("_accessibility").accessibilityToggleTextOff;
                var onLabel = this.model.get("_accessibility") && this.model.get("_accessibility").accessibilityToggleTextOn;

                var toggleText = isActive ? offLabel : onLabel;

                this.$el.html(toggleText).attr('aria-label', $.a11y_normalize(toggleText));

                if (isActive) {
                    $("html").addClass('accessibility');
                    $("#accessibility-instructions").a11y_focus();
                } else {
                    $("html").removeClass('accessibility');
                }
            }
        },

        toggleAccessibility: function(event) {
            if(event) event.preventDefault();

            var hasAccessibility = Adapt.config.get('_accessibility')._isActive;

            var toggleAccessibility = (hasAccessibility) ? false : true;

            Adapt.config.get('_accessibility')._isActive = toggleAccessibility;

            this.configureAccessibility();

            this.setupUsageInstructions();

            this.render();

            this.trigger('accessibility:toggle');
        },

        setupHelpers: function() {
            var config = Adapt.config.get("_accessibility");

            Handlebars.registerHelper('a11y_text', function(text) {
                //ALLOW ENABLE/DISABLE OF a11y_text HELPER
                if (config && config._isTextProcessorEnabled === false) {
                    return text;
                } else {
                    return $.a11y_text(text);
                }
            });
        },

        configureAccessibility: function() {

            var isActive = Adapt.config.get('_accessibility')._isActive;

            if (!Modernizr.touch && (Adapt.offlineStorage.get('a11y') !== isActive)) {
                Adapt.offlineStorage.set("a11y", isActive);
            }

            if (isActive) {

                _.extend($.a11y.options, {
                    isTabbableTextEnabled: true,
                    isUserInputControlEnabled: true,
                    isFocusControlEnabled: true,
                    isFocusLimited: true,
                    isRemoveNotAccessiblesEnabled: true,
                    isAriaLabelFixEnabled: true,
                    isFocusWrapEnabled: true,
                    isScrollDisableEnabled: true,
                    isScrollDisabledOnPopupEnabled: false,
                    isSelectedAlertsEnabled: true,
                    isAlertsEnabled: true
                });
            } else {
                _.extend($.a11y.options, {
                    isTabbableTextEnabled: false,
                    isUserInputControlEnabled: true,
                    isFocusControlEnabled: true,
                    isFocusLimited: false,
                    isRemoveNotAccessiblesEnabled: true,
                    isAriaLabelFixEnabled: true,
                    isFocusWrapEnabled: true,
                    isScrollDisableEnabled: true,
                    isScrollDisabledOnPopupEnabled: false,
                    isSelectedAlertsEnabled: false,
                    isAlertsEnabled: false
                });
            }

            $.a11y.ready();
        },

        setupUsageInstructions: function() {
            if (!this.model.get("_accessibility") || !this.model.get("_accessibility")._accessibilityInstructions) {
                $("#accessibility-instructions").remove();
                return;
            }

            var instructionsList =  this.model.get("_accessibility")._accessibilityInstructions;

            var usageInstructions;
            if (instructionsList[Adapt.device.browser]) {
                usageInstructions = instructionsList[Adapt.device.browser];
            } else if (Modernizr.touch) {
                usageInstructions = instructionsList.touch || "";
            } else {
                usageInstructions = instructionsList.notouch || "";
            }

           $("#accessibility-instructions").html( usageInstructions );
        }

    });

    return AccessibilityView;

});*/