import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import LoginPage from "./LoginPage.tsx";

const Login = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={"6Lc_6X4oAAAAAKI8AV9BkR2ftImeNRj0BP4uEjRe"}>
            <LoginPage/>
        </GoogleReCaptchaProvider>
    );
}

export default Login;