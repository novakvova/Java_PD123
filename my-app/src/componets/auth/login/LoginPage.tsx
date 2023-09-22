import {ILoginPage} from "./types.ts";
import http_common from "../../../http_common.ts";
import {useFormik} from "formik";
import {useNavigate} from "react-router-dom";
import InputGroup from "../../common/InputGroup.tsx";
import {AuthUserActionType, ILoginResult, IUser} from "../../../entities/Auth.ts";
import jwtDecode from "jwt-decode";
import {useDispatch} from "react-redux";

const LoginPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const init: ILoginPage = {
        email: "",
        password: ""
    };

    const onFormikSubmit = async (values: ILoginPage) => {
        try {
            const result = await http_common.post<ILoginResult>(`/api/account/login`, values);
            const {data} = result;
            const {token}= data;
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
            //console.log("login", result.data);
            navigate("..");
        }
        catch {
            console.log("Server error");
        }
    }

    const formik = useFormik({
        initialValues: init,
        onSubmit: onFormikSubmit
    });
    const {
        values,
        touched,
        errors,
        handleSubmit,
        handleChange
    } = formik;

    return (
        <>
            <h1 className="text-center">Вхід на сайт</h1>
            <form onSubmit={handleSubmit} className="col-md-6 offset-md-3">
                <InputGroup
                    label="Назва"
                    field="email"
                    type={"email"}
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    touched={touched.email}
                />

                <InputGroup
                    label="Назва"
                    field="password"
                    type={"password"}
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    touched={touched.password}
                />

                <button type="submit" className="btn btn-primary">
                    Вхід
                </button>
            </form>
        </>
    );
}

export default LoginPage;
