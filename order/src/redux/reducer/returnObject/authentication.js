import { LOGIN_FAILED, LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from "../../constants/constants";

let initialState = {
    isLoggin: false,
    user: {},
};

const reducer = (state = initialState, action) => {
    let { type, user } = action;
    switch (type) {
        case LOGIN_SUCCESSFUL:
            return {
                isLoggin: true,
                user,
            };
        case LOGIN_FAILED:
            return {
                isLoggin: false,
                user: {},
            };
        case LOGOUT_SUCCESSFUL:
            return {
                isLoggin: false,
                user: {},
            };

        default:
            break;
    }

    return state;
};

export default reducer;
