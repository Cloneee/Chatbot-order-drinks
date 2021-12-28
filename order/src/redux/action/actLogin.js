import {
    CLEAR_MESSAGE_FROM_SERVER,
    LOGIN_FAILED,
    LOGIN_SUCCESSFUL,
    LOGOUT_SUCCESSFUL,
    SET_MESSAGE_FROM_SERVER,
    STORE_PHONE_AND_PASSWORD_WHEN_LOGIN,
} from "../constants/constants";
import { API_SIGN_UP } from "../constants/api";
import LoginService from "../../services/LoginService";
import axios from "axios";
import { getProfile } from "./actStudent";

export const storePhoneAndPasswordWhenLogin = (key, value) => {
    //key and value was created to save a dynamic object
    return {
        type: STORE_PHONE_AND_PASSWORD_WHEN_LOGIN,
        key,
        value,
    };
};

export const login = (user) => {
    return (dispatch) => {
        return LoginService.login(user)
            .then((resp) => {
                dispatch({
                    type: LOGIN_SUCCESSFUL,
                    user: resp.data.profile
                })
                dispatch(getProfile(resp.data.profile.username))
                return Promise.resolve();
            })
            .catch((err) => {
                let MESSAGE =
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    err.toString();
           
                dispatch({
                    type: SET_MESSAGE_FROM_SERVER,
                    message: MESSAGE,
                });

                dispatch({
                    type: LOGIN_FAILED,
                });

                return Promise.reject(MESSAGE);
            });
    };
};
export const register = (user) => {
    return axios
        .post(API_SIGN_UP, user)
        .then((resp) => {
            return Promise.resolve();
        })
        .catch((err) => {
            console.log(err)
            let MESSAGE =
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    err.toString();
            // console.log(MESSAGE)
            return Promise.reject(MESSAGE);
        });
};

export const logout = () => {
    return (dispatch) => {
        return LoginService.logout()
            .then(() => {
                dispatch({
                    type: LOGOUT_SUCCESSFUL,
                });

                return Promise.resolve();
            })
            .catch((err) => {
                dispatch({
                    type: LOGOUT_SUCCESSFUL,
                });
                let MESSAGE =
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    err.toString();
                
                dispatch({
                    type: SET_MESSAGE_FROM_SERVER,
                    message: MESSAGE,
                });

                return Promise.reject(err);
            });
    };
};
