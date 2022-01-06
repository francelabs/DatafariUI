import { useContext, useEffect } from 'react';

import { QueryContext } from '../Contexts/query-context';
import { useTranslation } from 'react-i18next';

const useTitleUpdater = () => {
  const { query } = useContext(QueryContext);
  const { t } = useTranslation();

  useEffect(() => {
    const newTitle =
      query.elements && query.elements.length > 0
        ? `${query.elements} - ${t('Datafari Enterprise Search')}`
        : `${t('Datafari Enterprise Search')}`;
    document.title = newTitle;
  }, [query, t]);

  return {};
};

export default useTitleUpdater;
