define([
    'core/js/adapt',
    './languagePickerNavigationView'
], function(Adapt, NavigationView) {
    
    var LanguagePickerView = Backbone.View.extend({
        
        events: {
            'click .languagepicker-languages button': 'onLanguageClick'
        },
        
        className: 'languagepicker',
        
        initialize: function () {
            this.initializeAccessibility();
            $("html").addClass("in-languagepicker");
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },
        
        render: function () {
            var data = this.model.toJSON();
            var template = Handlebars.templates[this.constructor.template];
            this.$el.html(template(data));
            this.$el.addClass(data._classes);

            document.title = this.model.get('title') || "";
            
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
            this.navigationView = new NavigationView({model:this.model});
            
            // we need to re-render if accessibility gets switched on
            this.listenTo(Adapt, 'accessibility:toggle', this.render);
        },

        destroyAccessibility: function() {
            this.navigationView.remove();
        },

        remove: function() {
            $("html").removeClass("in-languagepicker");

            Backbone.View.prototype.remove.apply(this, arguments);
        }
        
    }, {
        template: 'languagePickerView'
    });

    return LanguagePickerView;

});
