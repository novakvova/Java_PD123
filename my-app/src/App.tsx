import './App.css'
import CategoryListPage from "./componets/admin/category/list/CategoryListPage.tsx";
import DefaultLayout from "./componets/containers/default/DefaultLayout.tsx";
import {Route, Routes} from "react-router-dom";
import CategoryCreatePage from "./componets/admin/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./componets/admin/category/edit/CategoryEditPage.tsx";
import ProductCreatePage from "./componets/admin/product/create/ProductCreatePage.tsx";
import LoginPage from "./componets/auth/login/LoginPage.tsx";
import HomePage from "./componets/home/HomePage.tsx";
function App() {


  return (
    <>
        <Routes>
            <Route path={"/"} element={<DefaultLayout/>}>
                <Route index element={<HomePage/>} />

                <Route path={"login"} element={<LoginPage/>}/>
            </Route>
            <Route path={"admin"} element={<DefaultLayout/>}>
                <Route index element={<CategoryListPage />} />
                <Route path={"create"} element={<CategoryCreatePage />} />
                <Route path="category/edit/:id" element={<CategoryEditPage />} />
                <Route path={"product"}>
                    <Route path="create" element={<ProductCreatePage />} />
                </Route>
            </Route>
        </Routes>
    </>
  )
}

export default App
