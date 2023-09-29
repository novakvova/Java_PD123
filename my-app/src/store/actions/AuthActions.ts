import {Dispatch} from "react";
import {AuthUserActionType, IUser, LoginSuccessAction, LogoutUserAction} from "../../entities/Auth.ts";
import http_common from "../../http_common.ts";
import jwtDecode from "jwt-decode";

export const LoginUser = (dispatch: Dispatch<LoginSuccessAction>, token: string) => {
    http_common.defaults.headers.common["Authorization"]=`Bearer ${token}`;
    localStorage.token = token;
    const user = jwtDecode(token) as IUser;
    dispatch({
        type: AuthUserActionType.LOGIN_USER,
        payload: {
            sub: user.sub,
            email: user.email,
            roles: user.roles
        }
    });
}

export const LogoutUser = (dispatch: Dispatch<LogoutUserAction>) => {
    localStorage.removeItem("token");
    http_common.defaults.headers.common["Authorization"]="";
    dispatch({type: AuthUserActionType.LOGOUT_USER});
}