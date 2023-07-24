//** Core */
import React, { useEffect, useState } from 'react';

//** Hooks */
import useYellowPages from '../../Hooks/useYellowPages';

const YellowPagesWidget = ({ show = true }) => {
  const { isLoading, data, error, reqIdentifier, getQuickLinks } = useYellowPages();

  return (
    show && (
      <div>
        <h1>Yellow Page</h1>
      </div>
    )
  );
};

export default YellowPagesWidget;
