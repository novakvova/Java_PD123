import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/js/bootstrap.bundle'

import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {store} from "./store";
import {Provider} from "react-redux";
import {LoginUserAction} from "./store/actions/AuthActions.ts";

if(localStorage.token) {
    LoginUserAction(store.dispatch, localStorage.token);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </>,
)
