import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  identifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        identifier: action.identifier,
      };
    case "ERROR":
      return {
        ...curHttpState,
        loading: false,
        error: {
          message: action.errorMessage,
          code: action.errorCode,
          identifier: action.identifier,
        },
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

  const sendRequest = useCallback(
    (url, method, body, reqIdentifier, headers) => {
      const currentID = reqIdentifier;
      dispatchHttp({ type: "SEND", identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: headers
          ? headers
          : {
              "Content-Type": "application/json",
            },
      })
        .then(async (response) => {
          if (currentID === reqIdentifier) {
            if (response.ok) {
              let data;
              if (
                response.headers.get("content-type").indexOf("text/html") !== -1
              ) {
                data = await response.text();
              } else {
                data = await response.json();
              }

              dispatchHttp({
                type: "RESPONSE",
                responseData: data,
                identifier: reqIdentifier,
              });
            } else {
              dispatchHttp({
                type: "ERROR",
                errorCode: response.status,
                errorMessage: response.statusText,
                identifier: reqIdentifier,
              });
            }
          }
        })
        .catch((error) => {
          if (currentID === reqIdentifier) {
            dispatchHttp({
              type: "ERROR",
              errorMessage: error.message,
              errorCode: -1,
              identifier: reqIdentifier,
            });
          }
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqIdentifier: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;
