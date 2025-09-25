import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    photo_url: string;
    specialization: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null,
    token: Cookies.get("token") || null,
    isAuthenticated: !!Cookies.get("token"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user as User;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;

            Cookies.set("token", action.payload.token, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });
            Cookies.set("user", JSON.stringify(action.payload.user), {
                expires: 7,
                secure: true,
                sameSite: "strict"
            });
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            Cookies.remove("user");  // ensure no bad user cookie remains
            Cookies.remove("token");
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            Cookies.remove("token");
            Cookies.remove("user");
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
    authSlice.actions;
export default authSlice.reducer;
