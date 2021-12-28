import { STORE_STUDENTS } from "../../constants/constants";

const initial = [];

const reducer = (state = initial, action) => {
    const { type, data } = action;
    
    switch (type) {
        case STORE_STUDENTS:

        console.log("abc")
        console.log(data)
        return data;
       
        default:
            return state;
    }
};

export default reducer