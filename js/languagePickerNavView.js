define([
    'core/js/adapt',
    'backbone',
    './languagePickerDrawerView'
], function(Adapt, Backbone, LanguagePickerDrawerView) {
    
    var LanguagePickerNavView = Backbone.View.extend({
        
        tagName: 'button',
        
        className: function () {
            var classNames = 'languagepicker-icon base icon';
            var customClass = this.model.get('_languagePickerIconClass') || 'icon-language-2';

            return classNames + ' ' + customClass;
        },
        
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
