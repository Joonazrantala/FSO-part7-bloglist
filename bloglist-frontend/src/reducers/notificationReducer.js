import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = { message: "", type: "" };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotification(state, action) {
      state.message = "";
      state.type = "";
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

let timeoutId;

export const newNotification = (message, type, duration = 5000) => {
  return (dispatch) => {
    if (timeoutId) clearTimeout(timeoutId);

    dispatch(setNotification({ message, type }));
    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
      timeoutId = null;
    }, duration);
  };
};
