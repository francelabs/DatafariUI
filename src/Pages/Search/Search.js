import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import './Search.css';

const Search = (props) => {
  const { t } = useTranslation();
  return (
    <h1>
      <Trans t={t}>Search Page</Trans>
    </h1>
  );
};

export default Search;
