import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import frLocale from 'date-fns/locale/fr';
import enLocale from 'date-fns/locale/en-US';
import deLocale from 'date-fns/locale/de';
import ptLocale from 'date-fns/locale/pt';
import itLocale from 'date-fns/locale/it';
import ruLocale from 'date-fns/locale/ru';
import esLocale from 'date-fns/locale/es';
import { format } from 'date-fns-tz';

export const DATE_RANGE = 'DATE_RANGE';

// Formats filters information. Uses details contained in the extra field if
// the extra.type field is supported, else returns the value.
const useFilterFormater = () => {
  const { i18n, t } = useTranslation();

  const getDateLocale = useCallback(() => {
    if (i18n.language) {
      switch (i18n.language) {
        case 'fr':
          return frLocale;
        case 'de':
          return deLocale;
        case 'it':
          return itLocale;
        case 'ru':
          return ruLocale;
        case 'es':
          return esLocale;
        case 'pt':
        case 'pt_br':
          return ptLocale;
        case 'en':
        default:
          return enLocale;
      }
    } else {
      return enLocale;
    }
  }, [i18n.language]);

  const filterFormat = useCallback(
    (filter) => {
      if (filter.extra && filter.extra.type) {
        switch (filter.extra.type) {
          case DATE_RANGE:
            if (filter.extra.from && filter.extra.to && filter.extra.field) {
              const dateLocale = getDateLocale();
              try {
                return `${filter.extra.field}: ${t('From')} ${format(
                  new Date(filter.extra.from),
                  'P',
                  {
                    locale: dateLocale,
                  }
                )} ${t('To')} ${format(new Date(filter.extra.to), 'P', {
                  locale: dateLocale,
                })}`;
              } catch (e) {
                // If any kind of exception happens, just return the filter value to be displayed.
                return filter.value;
              }
            } else {
              return filter.value;
            }
          default:
            return filter.value;
        }
      }
      return filter.value;
    },
    [getDateLocale, t]
  );

  return [filterFormat];
};

export default useFilterFormater;
