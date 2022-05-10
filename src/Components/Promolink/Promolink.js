import React, { useContext } from 'react';
import { ResultsContext } from '../../Contexts/results-context';
import PromoContent from './PromoContent';

function Promolink() {
  const {
    results: { promolinks = [] },
  } = useContext(ResultsContext);

  return promolinks.length
    ? promolinks.map((link) => <PromoContent {...link} />)
    : null;
}

export default Promolink;
