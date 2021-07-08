import Adapt from 'core/js/adapt';

export default class LanguagePickerModel extends Backbone.Model {

  defaults() {
    return {
      _isEnabled: false,
      displayTitle: '',
      body: '',
      _languages: []
    };
  }

  trackedData = {
    components: [],
    blocks: []
  }

  locationId = null;

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
      this.locationId = Adapt.offlineStorage.get('location') || null;
      this.restoreState();
    });
  }

  restoreLocation() {
    if (!Adapt.findById(this.locationId)) return;

    _.defer(() => Adapt.navigateToElement('.' + this.locationId));
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
      components: _.compact(this.getState(Adapt.components.models)),
      blocks: _.compact(this.getState(Adapt.blocks.models))
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
    const restoreModel = Adapt.findById(stateObject._id);
    if (!restoreModel) {
      Adapt.log.warn('LanguagePicker unable to restore state for: ' + stateObject._id);
      return;
    }

    restoreModel.setTrackableState(stateObject);
  }
}
