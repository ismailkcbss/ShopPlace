import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuth: false,
        user: {
            id: "",
            username: "",
            email: "",
            password: "",
            phone: "",
            image: "",
            admin: "",
        },
        token: "",
    },
    reducers: {
        login: (state, action) => {
            state.isAuth = true;
            state.user = { ...action.payload.user };
            state.token = action.payload.token;
        },
        set: (state,action) => {
            state.isAuth = true;
            state.user = { ...action.payload.user };
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = {
                id: "",
                username: "",
                email: "",
                password: "",
                phone: "",
                image: "",
                admin: "",
            };
            state.isAuth = false;
            state.token = "";
        }
    }
})

export const userActions = userSlice.actions;
export default userSlice.reducer;