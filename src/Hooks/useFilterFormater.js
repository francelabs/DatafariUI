import { format } from "date-fns-tz";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../Contexts/user-context";

export const DATE_RANGE = "DATE_RANGE";

// Formats filters information. Uses details contained in the extra field if
// the extra.type field is supported, else returns the value.
const useFilterFormater = () => {
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);

  const filterFormat = useCallback(
    (filter) => {
      if (filter.extra && filter.extra.type) {
        switch (filter.extra.type) {
          case DATE_RANGE:
            if (filter.extra.from && filter.extra.to && filter.extra.field) {
              const dateLocale = userState.userLocale.locale;
              try {
                return `${filter.extra.field}: ${t("From")} ${format(
                  new Date(filter.extra.from),
                  "P",
                  {
                    locale: dateLocale,
                  }
                )} ${t("To")} ${format(new Date(filter.extra.to), "P", {
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
    [userState, t]
  );

  return [filterFormat];
};

export default useFilterFormater;
