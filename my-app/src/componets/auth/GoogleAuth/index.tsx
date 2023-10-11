import { FaGoogle } from "react-icons/fa6";
import {useGoogleLogin} from "@react-oauth/google";
import http_common from "../../../http_common.ts";
const GoogleAuth = () => {

    const onGoogleLogin = useGoogleLogin({
       onSuccess: tokenResponse => {
           const {access_token} = tokenResponse;
           console.log("Token Response", access_token);
           http_common
               .get(
                   `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
                   {
                       headers: {
                           Accept: "application/json",
                       },
                   }
               )
               .then((res) => {
                   console.log("Google user info", res);
               });
       }
    });

    return (
        <>
            <button className="btn btn-danger" onClick={(e)=>{
                e.preventDefault();
                onGoogleLogin();
            }}>
                Через <FaGoogle/>
            </button>
        </>
    );
}

export default GoogleAuth;