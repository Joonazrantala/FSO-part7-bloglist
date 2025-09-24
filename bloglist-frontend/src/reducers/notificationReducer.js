import { createSlice } from "@reduxjs/toolkit"

const initialState = {message: "", type: ""}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification(state, action) {
            state.message = action.payload.message
            state.type = action.payload.type
        },
        clearNotification(state, action) {
            state.message = ""
            state.type = ""
        }
    }
})

export const {setNotification, clearNotification} = notificationSlice.actions
export default notificationSlice.reducer
