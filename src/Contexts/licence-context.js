import React, { useEffect, useState } from 'react';
import useLicence from '../Hooks/useLicence';
import Spinner from '../Components/Spinner/Spinner';
import { useTranslation } from 'react-i18next';

const defaultLicence = {
  type: undefined,
  files: undefined,
  users: undefined,
  time: undefined,
  contact: undefined,
  isLoading: false,
  error: null,
  isError: false,
};

export const LicenceContext = React.createContext(defaultLicence);

const LicenceContextProvider = (props) => {
  const { isLoading, data, isError, error } = useLicence();
  const [licence, setLicence] = useState(defaultLicence);

  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (data.status !== 'OK') {
        // We got an error returned by the API
        setLicence((currentLicence) => ({
          ...currentLicence,
          error: data.content,
          isLoading: false,
        }));
      } else {
        // The API responded with no error
        setLicence({
          ...data.content,
          isLoading: false,
        });
      }
    } else if (!isLoading && isError) {
      // We got an error from the HTTP request
      setLicence((currentLicence) => ({
        ...currentLicence,
        error: {
          technicalReason: error.response?.data?.content?.reason || error.message,
          reason: t('A problem has been detected concerning the licence'),
          code: error.code,
        },
        isError: true,
        isLoading: false,
      }));
    } else if (isLoading) {
      // We are loading
      setLicence((currentLicence) => ({
        ...currentLicence,
        isLoading,
      }));
    }
  }, [data, error, isError, isLoading]);

  return <LicenceContext.Provider value={licence}>{isLoading ? <Spinner /> : props.children}</LicenceContext.Provider>;
};

export default LicenceContextProvider;
