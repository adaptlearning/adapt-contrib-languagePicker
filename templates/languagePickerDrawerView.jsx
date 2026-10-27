import Adapt from 'core/js/adapt';
import React from 'react';
import { classes, compile } from 'core/js/reactHelpers';

export default function LanguagePickerDrawerView(props) {
  const {
    _languages,
    onButtonClick
  } = props;
  const languageSelector = Adapt.course.get('_globals')?._extensions?._languagePicker?.languageSelector;
  return (
    <div className="languagepicker-drawer">
      <div
        className="aria-label"
        dangerouslySetInnerHTML={{ __html: languageSelector ?? '' }}
      />

      <div className="languagepicker-drawer__inner" role="list">

        {_languages.map((language) => {
          const {
            _language,
            _direction,
            _isSelected,
            _isDisabled,
            displayName
          } = language;
          const isDisabled = _isSelected || _isDisabled;
          return (
            <div
              className={classes([
                'languagepicker-drawer__item',
                'drawer__item',
                `is-${_language}`,
                _isSelected && 'is-selected',
                _direction === 'ltr' && 'is-ltr',
                _direction === 'rtl' && 'is-rtl'
              ])}
              role="listitem"
              key={_language}
            >

              <button
                className={classes([
                  'languagepicker-drawer__item-btn',
                  'drawer__item-btn',
                  'js-languagepicker-item-btn',
                  isDisabled && 'is-disabled'
                ])}
                data-language={_language}
                aria-disabled={isDisabled ? 'true' : null}
                tabIndex={isDisabled ? -1 : null}
                aria-current={_isSelected ? 'true' : null}
                lang={_language}
                onClick={onButtonClick}
              >
                <span className="languagepicker-drawer__title drawer__item-title">
                  <span
                    className="languagepicker-drawer__title-inner drawer__item-title-inner"
                    dangerouslySetInnerHTML={{ __html: compile(displayName, language) }}
                  />
                </span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
