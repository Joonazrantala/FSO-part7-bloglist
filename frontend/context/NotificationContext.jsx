import { createContext, useReducer, useRef } from "react";

const initialState = { message: "", type: "" }
const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET":
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    case "CLEAR":
      return {
        message: "",
        type: "",
      };
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, initialState);
  const timeoutRef = useRef(null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
