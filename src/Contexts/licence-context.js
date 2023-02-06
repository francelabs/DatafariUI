import React, { useEffect, useState } from 'react';
import useLicence from '../Hooks/useLicence';
import produce from 'immer';
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
};

export const LicenceContext = React.createContext(defaultLicence);

const LicenceContextProvider = (props) => {
  const queryID = 'GETLICENCEQUERY';
  const { getLicence, isLoading, data, error, reqIdentifier } = useLicence();
  const [licence, setLicence] = useState(defaultLicence);

  const { t } = useTranslation();

  useEffect(() => {
    try {
      getLicence(queryID);
    } catch (error) {
      setLicence({ error: t('A problem has been detected concerning the licence') });
      console.error('Error with licence', error);
    }
  }, [getLicence]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      if (data.status !== 'OK') {
        // We got an error returned by the API
        setLicence((currentLicence) => {
          return produce(currentLicence, (licenceDraft) => {
            const errorData = data.content;
            licenceDraft.error = errorData;
          });
        });
      } else {
        // The API responded with no error
        setLicence((currentLicence) => {
          return produce(currentLicence, (licenceDraft) => {
            const licenceData = data.content;
            licenceDraft.contact = licenceData.contact;
            licenceDraft.type = licenceData.type;
            licenceDraft.files = licenceData.files;
            licenceDraft.time = licenceData.time;
            if (licenceData.users) {
              licenceDraft.users = licenceData.users;
            }
            licenceDraft.isLoading = isLoading;
          });
        });
      }
    } else if (!isLoading && error && reqIdentifier === queryID) {
      // We got an error from the HTTP request
      setLicence((currentLicence) => {
        return produce(currentLicence, (licenceDraft) => {
          licenceDraft.error = {
            reason: error.message,
            code: error.code,
          };
          licenceDraft.isLoading = isLoading;
        });
      });
    } else if (isLoading && reqIdentifier === queryID) {
      // We are loading
      setLicence((currentLicence) => {
        return produce(currentLicence, (licenceDraft) => {
          licenceDraft.isLoading = isLoading;
        });
      });
    }
  }, [data, error, isLoading, queryID, reqIdentifier]);

  return <LicenceContext.Provider value={licence}>{isLoading ? <Spinner /> : props.children}</LicenceContext.Provider>;
};

export default LicenceContextProvider;
