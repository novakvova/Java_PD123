import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {IAuthUser} from "../../../entities/Auth.ts";

const AdminLayout = () => {
    const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);
    const navigate = useNavigate();

    const isAdmin = isAuth && user?.roles.includes("admin");

    console.log("Roles = ", user?.roles);
    console.log("Roles = ", user?.roles);
    useEffect(() => {
        if (!isAuth) navigate("/login");
        if(isAuth) {
            if(!user?.roles.includes("admin")) {
                navigate("/pages/403")
            }
        }
    }, []);

    return (
        <>
            <AdminHeader />

            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <AdminSidebar />

                    <div className="col py-3">
                        {/* Сюди підставляється компонет один із групи комеонетів, які відносяться до даного Layout */}
                        {isAdmin && <Outlet />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
