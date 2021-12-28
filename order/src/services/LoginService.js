import axios from "axios";
import { API_SIGN_IN, API_SIGN_OUT } from "../redux/constants/api";

function LoginService() {}

LoginService.prototype = {
    login(user) {
        return axios.post(API_SIGN_IN, user, {withCredentials: false}).then((resp) => {
            const accessToken = resp.data.token;
            const username = resp.data.profile.username;
            if (accessToken) {
                sessionStorage.setItem("accessToken", accessToken);
                sessionStorage.setItem("username", username);
                axios.interceptors.request.use(function (config) {
                    return config;
                });
                
            }

            return resp;
        });
    },
    logout() {
        return axios.post(API_SIGN_OUT, {}, { withCredentials: false });
    },
};

export default new LoginService();
