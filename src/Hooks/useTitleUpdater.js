import { useContext, useEffect } from 'react';

import { QueryContext } from '../Contexts/query-context';
import { useTranslation } from 'react-i18next';

const useTitleUpdater = () => {
  const { query } = useContext(QueryContext);
  const { t } = useTranslation();

  useEffect(() => {
    const newTitle =
      query.elements && query.elements.length > 0
        ? `${query.elements.substring(
            0,
            query.elements.length > 2048 ? 2048 : query.elements.length
          )} - ${t('Datafari Enterprise Search')}`
        : `${t('Datafari Enterprise Search')}`;
    document.title = newTitle;
  }, [query, t]);

  return {};
};

export default useTitleUpdater;
