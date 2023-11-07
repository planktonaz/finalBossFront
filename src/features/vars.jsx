import {createSlice} from "@reduxjs/toolkit";

export const varsSlice = createSlice({
    name: "vars",
    initialState: {
        users: [],
        user: {
            id: "",
            username: "",
            image: "",
        },
        posts: [],
        uniqueUsers: [],
        userMessages: [],
        selectedUser: "",
        postComments:[],
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setPosts: (state, action) => {
            state.posts = action.payload
        },
        addPost: (state, action) => {
            state.posts.push(action.payload)
        },
        setUniqueUsers: (state, action) => {
            state.uniqueUsers = action.payload
        },
        setUserMessages: (state, action) => {
            state.userMessages = action.payload
        },
        addUserMessage: (state, action) => {
            state.userMessages.push(action.payload)
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setPostComments: (state, action) => {
            state.postComments = action.payload
        },
    }
})

export const {
    setUser,
    setUsers,
    setPosts,
    addPost,
    setUniqueUsers,
    setUserMessages,
    addUserMessage,
    setSelectedUser,
    setPostComments,
} = varsSlice.actions

export default varsSlice.reducer;