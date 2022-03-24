import Adapt from 'core/js/adapt';
import offlineStorage from 'core/js/offlineStorage';
import data from 'core/js/data';
import logging from 'core/js/logging';
import router from 'core/js/router';

export default class LanguagePickerModel extends Backbone.Model {
  preinitialize() {
    this.trackedData = {
      components: [],
      blocks: []
    };

    this.locationId = null;
  }

  defaults() {
    return {
      _isEnabled: false,
      displayTitle: '',
      body: '',
      _languages: []
    };
  }

  initialize() {
    this.listenTo(Adapt.config, 'change:_activeLanguage', this.markLanguageAsSelected);
    this.listenTo(Adapt, 'app:dataLoaded', this.onDataLoaded);
  }

  getLanguageDetails(language) {
    return this.get('_languages').find(({ _language }) => _language === language);
  }

  setLanguage(language) {
    Adapt.config.set({
      _activeLanguage: language,
      _defaultDirection: this.getLanguageDetails(language)._direction
    });
  }

  markLanguageAsSelected(model, language) {
    this.get('_languages').forEach(item => {
      item._isSelected = (item._language === language);
    });
  }

  onDataLoaded() {
    if (!this.get('_restoreStateOnLanguageChange')) {
      return;
    }
    _.defer(() => {
      this.locationId = offlineStorage.get('location') || null;
      this.restoreState();
    });
  }

  restoreLocation() {
    if (!data.findById(this.locationId)) return;

    _.defer(() => router.navigateToElement('.' + this.locationId));
  }

  /**
   * Restore course progress on language change.
   */
  restoreState() {

    if (this.isTrackedDataEmpty()) return;

    this.trackedData.components?.forEach(this.setTrackableState);
    this.trackedData.blocks?.forEach(this.setTrackableState);
  }

  isTrackedDataEmpty() {
    return _.isEqual(this.trackedData, {
      components: [],
      blocks: []
    });
  }

  getTrackableState() {
    return {
      components: this.getState(Adapt.components.models).filter(Boolean),
      blocks: this.getState(Adapt.blocks.models).filter(Boolean)
    };
  }

  getState(models) {
    return models.map(model => model.get('_isComplete') && model.getTrackableState());
  }

  setTrackedData() {
    if (!this.get('_restoreStateOnLanguageChange')) {
      return;
    }
    this.listenToOnce(Adapt, 'contentObjectView:ready', this.restoreLocation);
    this.trackedData = this.getTrackableState();
  }

  setTrackableState(stateObject) {
    const restoreModel = data.findById(stateObject._id);
    if (!restoreModel) {
      logging.warn('LanguagePicker unable to restore state for: ' + stateObject._id);
      return;
    }

    restoreModel.setTrackableState(stateObject);
  }
}
