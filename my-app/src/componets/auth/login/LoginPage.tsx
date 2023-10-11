import {ILoginPage} from "./types.ts";
import http_common from "../../../http_common.ts";
import {useFormik} from "formik";
import {useNavigate} from "react-router-dom";
import InputGroup from "../../common/InputGroup.tsx";
import { ILoginResult } from "../../../entities/Auth.ts";
import {useDispatch} from "react-redux";
import {LoginUser} from "../../../store/actions/AuthActions.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useState} from "react";
import GoogleAuth from "../GoogleAuth";
import {GoogleOAuthProvider} from "@react-oauth/google";


const LoginPage = () => {
    const [messageError, setMessageError] = useState<string>();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const init: ILoginPage = {
        email: "",
        password: "",
        recaptchaToken: ""
    };

    const onFormikSubmit = async (values: ILoginPage) => {
        try {
            if(!executeRecaptcha) {
                alert("Ви бот :(");
                return;
            }
            values.recaptchaToken = await executeRecaptcha();
            const result = await http_common.post<ILoginResult>(`/api/account/login`, values);
            LoginUser(dispatch, result.data.token);
            navigate("..");
        }
        catch {
            console.log("Server error");
            setMessageError("Дані вказано не вірно");
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
                {messageError &&
                <div className="alert alert-danger" role="alert">
                    {messageError}
                </div>
                }


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

                <GoogleOAuthProvider clientId={"677018736139-cqtkjj1u88g5ccr0h7bjnl1qb1lbhqif.apps.googleusercontent.com"}>
                    <GoogleAuth/>
                </GoogleOAuthProvider>

                <button type="submit" className="btn btn-primary">
                    Вхід
                </button>
            </form>
        </>
    );
}

export default LoginPage;
