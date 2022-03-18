import { format } from 'date-fns';
import React, { useContext } from 'react';
import { UserContext } from '../../../Contexts/user-context';
import RangeFacet from './RangeFacet';

const REF_KEY = 'DateRangeFacet';

function DateRangeFacet(props) {
  const { state: userState } = useContext(UserContext);

  const dateFormatter = (value) => {
    const date = new Date(value);
    return isNaN(date) ? '' : format(date, userState.userLocale.dateFormat);
  };

  return (
    <RangeFacet
      refKey={REF_KEY}
      tag="DateRangeFacet"
      xAxisLabelFormatter={dateFormatter}
      brushTickFormatter={() => ''}
      {...props}
    />
  );
}

export default DateRangeFacet;
