define([
        'core/js/adapt'
], function (Adapt) {
    
    var LanguagePickerModel = Backbone.Model.extend({
        
        defaults: {
            "_isEnabled": false,
            "displayTitle": "",
            "body": "",
            "_languages": []
        },
        
        trackedData: {
            "components": [],
            "blocks": []
        },

        locationId: null,
        
        initialize: function () {
            this.listenTo(Adapt.config, 'change:_activeLanguage', this.onConfigChange);
            if (this.get('_restoreStateOnLanguageChange')) {
                this.listenTo(Adapt, 'app:dataLoaded', this.onDataLoaded);
            }
        },

        getLanguageDetails: function (language) {
            var _languages = this.get('_languages');
            return _.find(_languages, function (item) {
                return (item._language == language);
            });
        },

        setLanguage: function (language) {
            Adapt.config.set({
                '_activeLanguage': language,
                '_defaultDirection': this.getLanguageDetails(language)._direction
            });
        },
        
        onConfigChange: function (model, value, options) {
            this.markLanguageAsSelected(value);
        },
        
        markLanguageAsSelected: function(language) {
            var languages = this.get('_languages');

            for (var i = 0; i < languages.length; i++) {
                if (languages[i]._language === language) {
                    languages[i]._isSelected = true;
                } else {
                    languages[i]._isSelected = false;
                }
            }

            this.set('_languages', languages);
        },
            
        onDataLoaded: function() {
            _.defer(function() {
                this.locationId = Adapt.offlineStorage.get('location') || null;
                this.restoreState();
            }.bind(this));

        },
        
        restoreLocation: function() {
            if (!Adapt.mapById(this.locationId)) return;
            _.defer(function() {
                Adapt.navigateToElement('.' + this.locationId);
            }.bind(this));
        },

        /**
         * Restore course progress on language change.
         */
        restoreState: function() {

            if (this.isTrackedDataEmpty()) return;

            var components = this.trackedData.components;
            var blocks = this.trackedData.blocks;

            if (components) {
                components.forEach(this.setTrackableState);
            }

            if (blocks) {
                blocks.forEach(this.setTrackableState);
            }
        },

        isTrackedDataEmpty: function() {
            return _.isEqual(this.trackedData, {
                "components": [],
                "blocks": []
            });
        },

        getTrackableState: function() {
            var components = this.getState(Adapt.components.models);
            var blocks = this.getState(Adapt.blocks.models);
            return {
                "components": _.compact(components),
                "blocks": _.compact(blocks)
            };
        },

        getState: function(models) {
            return models.map(function(model) {
                if (model.get('_isComplete')) {
                    return model.getTrackableState();
                }
            });
        },

        setTrackedData: function() {
            if (this.get('_restoreStateOnLanguageChange')) {
                this.listenToOnce(Adapt, 'menuView:ready', this.restoreLocation);
                this.trackedData = this.getTrackableState();
            }
        },

        setTrackableState: function(stateObject) {
            var restoreModel = Adapt.findById(stateObject._id);

            if (restoreModel) {
                restoreModel.setTrackableState(stateObject);
            } else {
                Adapt.log.warn('LanguagePicker unable to restore state for: ' + stateObject._id);
            }
        }
        
    });
    
    return LanguagePickerModel;
    
});
