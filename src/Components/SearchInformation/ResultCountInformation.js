import React from 'react';
import { useTranslation } from 'react-i18next';

const ResultCountInformation = (props) => {
  const { t } = useTranslation();
  return (
    <>
      {props.numFound > 0 &&
        t('Results {{ start }} - {{ end }} of {{ total }}', {
          start: props.start + 1,
          end:
            props.start + props.rows < props.numFound
              ? props.start + props.rows
              : props.numFound,
          total: props.numFound,
        })}
      {props.numFound === 0 && t('No results found')}{' '}
    </>
  );
};

export default ResultCountInformation;
