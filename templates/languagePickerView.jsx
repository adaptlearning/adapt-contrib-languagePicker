import React from 'react';
import { classes, compile } from 'core/js/reactHelpers';

export default function LanguagePickerView(props) {
  const {
    backgroundImage,
    backgroundStyles,
    _backgroundStyles,
    _graphic,
    displayTitle,
    body,
    _languages,
    onLanguageClick
  } = props;
  return (
    <>
      {backgroundImage &&
      <div
        className="background"
        aria-hidden="true"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          ...(backgroundStyles && {
            backgroundRepeat: _backgroundStyles._backgroundRepeat,
            backgroundSize: _backgroundStyles._backgroundSize,
            backgroundPosition: _backgroundStyles._backgroundPosition
          })
        }}
      />
      }

      <div className="languagepicker__inner">

        {_graphic?.src &&
        <div className="languagepicker__image-container">
          <img className="languagepicker__image" src={_graphic.src} alt={_graphic.alt} loading="eager" />
        </div>
        }

        {displayTitle &&
        <div className="languagepicker__title">
          <div
            className="languagepicker__title-inner"
            role="heading"
            aria-level="1"
            dangerouslySetInnerHTML={{ __html: compile(displayTitle, props) }}
          />
        </div>
        }

        {body &&
        <div className="languagepicker__body">
          <div
            className="languagepicker__body-inner"
            dangerouslySetInnerHTML={{ __html: compile(body, props) }}
          />
        </div>
        }

        <div className="languagepicker__languages">
          <div className="languagepicker__languages-inner">

            {_languages.map((language) => {
              const {
                _language,
                _isDisabled,
                displayName
              } = language;
              return (
                <button
                  className={classes([
                    'btn-text',
                    'languagepicker__language-btn',
                    `is-${_language}`,
                    'js-languagepicker-btn-click',
                    _isDisabled && 'is-disabled'
                  ])}
                  value={_language}
                  aria-disabled={_isDisabled ? 'true' : null}
                  tabIndex={_isDisabled ? -1 : null}
                  lang={_language}
                  onClick={onLanguageClick}
                  key={_language}
                  dangerouslySetInnerHTML={{ __html: compile(displayName, language) }}
                />
              );
            })}

          </div>
        </div>

      </div>
    </>
  );
}
