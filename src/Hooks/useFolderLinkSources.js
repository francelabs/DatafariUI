import { useContext, useState } from "react";
import { UIConfigContext } from "../Contexts/ui-config-context";

// Creating a hook to contain the list of sources for which the open folder link is available
// to make it easier to integrate with a future backend API allowing to get that list.
// For now, hardcode the list of sources in the empty array in useState.
const useFolderLinkSources = () => {
  const {
    uiDefinition: { resultsList = { folderLinkSources: [] } },
  } = useContext(UIConfigContext);

  const [folderLinkSources] = useState(resultsList.folderLinkSources);

  return [folderLinkSources];
};

export default useFolderLinkSources;
