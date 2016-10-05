define([
    'core/js/adapt',
    'backbone',
    './languagePickerDrawerView'
], function(Adapt, Backbone, LanguagePickerDrawerView) {
    
    var LanguagePickerNavView = Backbone.View.extend({
        
        tagName: 'button',
        
        className: 'languagepicker-icon base icon icon-language',
        
        events: {
            'click': 'onClick'
        },
        
        initialize: function () {
            this.listenTo(Adapt, 'remove', this.remove);
        },
        
        onClick: function (event) {
            Adapt.drawer.triggerCustomView(new LanguagePickerDrawerView({model: this.model}).$el, false);
        }
        
    });

    return LanguagePickerNavView;

});
