define([
    'core/js/adapt',
    './accessibilityView'
], function(Adapt, AccessibilityView) {

    var NavigationView = Backbone.View.extend({

        className: "navigation",

        initialize: function() {
            this.listenToOnce(Adapt, 'accessibility:toggle', this.onA11yToggle);
            this.template = "languagePickerNavigation";
            this.setupHelpers();
            this.preRender();
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

            Handlebars.registerHelper('a11y_aria_label', function(text) {
                return '<div class="aria-label prevent-default">'+text+'</div>';
            });
        },

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