//** Core */
import React, { useEffect, useState } from 'react';

//** Hooks */
import useDirectAccess from '../../Hooks/usDirectAccess';

const DirectAccessWidget = ({ show = true }) => {
  const { isLoading, data, error, reqIdentifier, getQuickLinks } = useDirectAccess();

  return (
    show && (
      <div>
        <h1>Quick Links</h1>
      </div>
    )
  );
};

export default DirectAccessWidget;
