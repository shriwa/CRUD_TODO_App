import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = ({ message, type }) => {
  React.useEffect(() => {
    if (message) {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        case "warning":
          toast.warn(message);
          break;
        default:
          toast(message);
      }
    }
  }, [message, type]);

  return <ToastContainer />;
};

export default ToastNotification;
