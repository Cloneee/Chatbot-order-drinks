import axios from "axios";
import {  API_SIGN_UP, API_STUDENT,  } from "../constants/api";
import {
    createAction,
    STORE_PROFILE,
    STORE_STUDENTS,
    STORE_STUDENT_BY_ID,
   
} from "../constants/constants";

export const getStudents = () => {
    return (dispatch) => {
        return axios

            .get(API_STUDENT)

            .then((resp) => {
                console.log("actStudent")
                console.log(resp.data)
                dispatch(createAction(STORE_STUDENTS, resp.data.data));
            })
            .catch((err) => {
                dispatch(createAction(STORE_STUDENTS, {}));
            });
    };
};

export const getstudentById = (StudentId) => {
    return (dispatch) => {
        return axios
            .get(API_STUDENT + `/${StudentId}`)
            .then((resp) => {
                dispatch(createAction(STORE_STUDENT_BY_ID, resp.data));
                return Promise.resolve()
            })
            .catch((err) => console.error(err));
    };
};
export const getProfile = (StudentId) => {
    return (dispatch) => {
        return axios
            .get(API_STUDENT + `/${StudentId}`)
            .then((resp) => {
            
                dispatch(createAction(STORE_PROFILE, resp.data));
            })
            .catch((err) =>  dispatch(createAction(STORE_PROFILE,{})));
    };
};


export const updateStudents = (student) => {
    return (dispatch) => {
        return axios
            .put(API_STUDENT + `/${student.username}`, student, { withCredentials: true })
            .then((resp) => {


            })
            .catch((err) => console.error(err));
    };
};

export const deleteStudent = (student) => {
    return (dispatch) => {
        return axios
            .delete(API_STUDENT + `/${student.id}`)
            .then(() => {

            })
            .catch((err) => console.error(err));
    };
};

export const addStudent = (student) => {
    return (dispatch) => {
        return axios
            .post(API_SIGN_UP, student)
            .then((resp) => {

            })
            .catch((err) => console.error(err));
    };
};
