import './App.css'
import CategoryListPage from "./componets/admin/category/list/CategoryListPage.tsx";
import DefaultLayout from "./componets/containers/default/DefaultLayout.tsx";
import {Route, Routes} from "react-router-dom";
import CategoryCreatePage from "./componets/admin/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./componets/admin/category/edit/CategoryEditPage.tsx";
import ProductCreatePage from "./componets/admin/product/create/ProductCreatePage.tsx";
import HomePage from "./componets/home/HomePage.tsx";
import AdminLayout from "./componets/containers/admin/AdminLayout.tsx";
import AdminHomePage from "./componets/admin/home/AdminHomePage.tsx";
import Login from "./componets/auth/login";
function App() {


  return (
    <>
        <Routes>
            <Route path={"/"} element={<DefaultLayout/>}>
                <Route index element={<HomePage/>} />

                <Route path={"login"} element={<Login/>}/>
            </Route>
            <Route path={"admin"} element={<AdminLayout/>}>
                <Route index element={<AdminHomePage />} />
                <Route path={"category"}>
                    <Route index element={<CategoryListPage />} />
                    <Route path={"create"} element={<CategoryCreatePage />} />
                    <Route path="edit/:id" element={<CategoryEditPage />} />
                    <Route path={"product"}>
                        <Route path="create" element={<ProductCreatePage />} />
                    </Route>
                </Route>

            </Route>
        </Routes>
    </>
  )
}

export default App
