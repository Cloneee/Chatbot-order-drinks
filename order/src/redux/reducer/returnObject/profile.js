import { STORE_PROFILE } from "../../constants/constants";

const initial = {};

const reducer = (state = initial, action) => {
    const { type, data } = action;
    switch (type) {
        case STORE_PROFILE:



            return { ...data };

        default:
            return state;
    }
};

export default reducer;
