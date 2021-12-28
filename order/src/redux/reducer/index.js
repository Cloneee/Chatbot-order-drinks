import { combineReducers } from "redux";

import authentication from "./returnObject/authentication";
import studentById from "./returnObject/studentById";
import profile from "./returnObject/profile";
import departments from "./returnArray/departments"
import students from "./returnArray/students"

const reducer = combineReducers({
    authentication,
    studentById,
    profile,
    departments,
    students


});

export default reducer;
