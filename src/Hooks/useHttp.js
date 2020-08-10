import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  identifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
      };
    case 'ERROR':
      return {
        ...curHttpState,
        loading: false,
        error: {
          message: action.errorMessage,
          code: action.errorCode,
        },
      };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback((url, method, body, reqIdentifer) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          dispatchHttp({
            type: 'ERROR',
            errorCode: response.status,
            errorMessage: response.statusText,
          });
        }
      })
      .then((responseData) => {
        dispatchHttp({
          type: 'RESPONSE',
          responseData: responseData,
        });
      })
      .catch((error) => {
        dispatchHttp({
          type: 'ERROR',
          errorMessage: error.message,
          errorCode: -1,
        });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqIdentifer: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;
