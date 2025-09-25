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
            state.push(action.payload) 
        },
        findlikes(state, action) {
            const id = action.payload
            const likes = state.find(b => b.id === id)
            return likes
        },
        likeBlog(state, action) {
            const id = action.payload
            return state.map(b => b.id === id ? { ...b, likes: b.likes + 1 } : b)
        },
        deleteBlog(state, action) {
            const id = action.payload
            return state.filter(b => b.id !== id)
        }
    }
})

export const { setBlogs, createBlog, findlikes, likeBlog, deleteBlog } = blogSlice.actions
export default blogSlice.reducer