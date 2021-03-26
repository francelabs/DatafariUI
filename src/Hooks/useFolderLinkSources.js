import { useState } from 'react';

// Creating a hook to contain the list of sources for which the open folder link is available
// to make it easier to integrate with a future backend API allowing to get that list.
// For now, hardcode the list of sources in the empty array in useState.
const useFolderLinkSources = () => {
  const [folderLinkSources] = useState([
    /*'fileShare1', 'someSPSite'*/
  ]);

  return [folderLinkSources];
};

export default useFolderLinkSources;
