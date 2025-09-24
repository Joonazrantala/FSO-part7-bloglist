import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        createBlog(state, action) {
            return
        }
    }
})

export const { setBlogs } = blogSlice.actions
export default blogSlice.reducer