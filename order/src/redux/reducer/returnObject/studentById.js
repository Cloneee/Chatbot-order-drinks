import {  STORE_STUDENT_BY_ID } from "../../constants/constants";

const initial = {};

const reducer = (state = initial, action) => {
    const { type, data } = action;
    switch (type) {
        case STORE_STUDENT_BY_ID:
            return {...data};

        default:
            return state;
    }
};

export default reducer;
