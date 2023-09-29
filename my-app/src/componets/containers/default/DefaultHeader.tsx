import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../../store/hooks/useTypedSelector.ts";
import {LogoutUser} from "../../../store/actions/AuthActions.ts";

const DefaultHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuth, user} = useTypedSelector(state => state.auth);
    const isAdmin = isAuth && user?.roles.includes("admin");
    return (
        <>
            <header data-bs-theme="dark">
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">Одяг</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                { isAdmin ?
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">Адмін панель</Link>
                                    </li>
                                    : <></>
                                }

                                <li className="nav-item">
                                    <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                                </li>
                            </ul>
                            {isAuth ?(
                                <ul className={"navbar-nav"}>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/profile">
                                            {user?.email}
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <button className="nav-link active" aria-current="page" onClick={() =>{
                                            LogoutUser(dispatch);
                                            navigate("/");
                                        }}>Вихід</button>
                                    </li>
                                </ul>
                                ) : (
                                <ul className={"navbar-nav"}>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/login">Вхід</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/register">Реєстрація</Link>
                                    </li>
                                </ul>

                                )}

                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default DefaultHeader;
