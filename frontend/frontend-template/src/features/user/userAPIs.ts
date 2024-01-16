import {resetAdminState, updateUser} from "./userSlice"
import axios from "axios"
import {AnyAction, Dispatch} from "@reduxjs/toolkit";

export interface ErrorResponse {
    timestamp: string,
    status: number,
    error: string,
    message: string
}

export interface UserLoginDetails {
    username: string,
    password: string,
}

export const userLoginAPI = async (userData: UserLoginDetails, dispatch: Dispatch<AnyAction>) => {
    try {
        const response = await axios.post("http://localhost:8080/user/login", userData);
        dispatch(updateUser(response.data as string));
        localStorage.setItem("user", response.data as string);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(resetAdminState());
            console.error(error.response as ErrorResponse);
        } else {
            dispatch(resetAdminState());
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
        }
    }
};
