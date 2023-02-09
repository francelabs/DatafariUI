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
  isError: false,
};

export const LicenceContext = React.createContext(defaultLicence);

const LicenceContextProvider = (props) => {
  const queryID = 'GETLICENCEQUERY';
  const { isLoading, data, isError, error } = useLicence();
  const [licence, setLicence] = useState(defaultLicence);

  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && !isError && data) {
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
    } else if (!isLoading && isError) {
      // We got an error from the HTTP request
      setLicence((currentLicence) => {
        return produce(currentLicence, (licenceDraft) => {
          licenceDraft.error = {
            technicalReason: error.response?.data?.content?.reason || error.message,
            reason: t('A problem has been detected concerning the licence'),
            code: error.code,
          };
          licenceDraft.isError = isError;
          licenceDraft.isLoading = isLoading;
        });
      });
    } else if (isLoading) {
      // We are loading
      setLicence((currentLicence) => {
        return produce(currentLicence, (licenceDraft) => {
          licenceDraft.isLoading = isLoading;
        });
      });
    }
  }, [data, error, isError, isLoading, queryID]);

  return <LicenceContext.Provider value={licence}>{isLoading ? <Spinner /> : props.children}</LicenceContext.Provider>;
};

export default LicenceContextProvider;
