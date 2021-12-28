import axios from "axios";
import { API_DEPARTMENT } from "../constants/api";
import {
    createAction,
    STORE_DEPARTMENTS,
    
} from "../constants/constants";

export const getDepartments = () => {
    return (dispatch) => {
        return axios
            .get(API_DEPARTMENT,{withCredentials:true})
            .then((resp) => {
                console.log(resp.data)
                dispatch(createAction(STORE_DEPARTMENTS, resp.data));
            })
            .catch((err) => console.error(err));
    };
};