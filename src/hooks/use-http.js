import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

import { toast } from "react-toastify";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

  const successNotificaion = (message) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const errorNotificaion = (message) => {
    if (!message) {
      message = "Something went wrong!";
    }
    return toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const sendRequest = useCallback(
    async (requestConfig, applyData) => {
      setIsLoading(true);
      setError(null);
      let body = null;
      if (requestConfig.formData) {
        body = requestConfig.formData;
      } else {
        body = requestConfig.body ? JSON.stringify(requestConfig.body) : null;
      }
      try {
        const response = await fetch(serverAddress + requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : "GET",
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: body,
          credentials: "include",
        });
        const res = await response.json();

        //If unauthorized, logout and redirect
        if (response.status === 401) {
          localStorage.removeItem("user");
          dispatch(authActions.logout());
        }

        //If response not ok throw error
        if (!response.ok) {
          throw new Error(res.message);
        } else {
          //Show success notification
          if (res.message) {
            successNotificaion(res.message);
          }
        }
        //If there is data in response send it to component
        if (applyData) {
          if (res.data) {
            applyData(res.data);
          } else {
            applyData();
          }
        }
      } catch (err) {
        setError(err.message || "Something went wrong!");
        //Show notifications for messages
        errorNotificaion(err.message);
      }
      setIsLoading(false);
    },
    [dispatch, serverAddress]
  );

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
