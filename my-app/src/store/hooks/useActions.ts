import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import ActionCreators from "../actions/ActionCreators.ts";

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(ActionCreators, dispatch);
}