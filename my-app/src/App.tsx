import './App.css'
import CategoryListPage from "./componets/category/list/CategoryListPage.tsx";
import DefaultLayout from "./componets/containers/default/DefaultLayout.tsx";
import {Route, Routes} from "react-router-dom";
import CategoryCreatePage from "./componets/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./componets/category/edit/CategoryEditPage.tsx";
import ProductCreatePAge from "./componets/product/create/ProductCreatePage.tsx";
function App() {


  return (
    <>
        <Routes>
            <Route path={"/"} element={<DefaultLayout/>}>
                <Route index element={<CategoryListPage />} />
                <Route path={"create"} element={<CategoryCreatePage />} />
                <Route path="category/edit/:id" element={<CategoryEditPage />} />
                <Route path={"product"}>
                    <Route path="create" element={<ProductCreatePAge />} />
                </Route>
            </Route>
        </Routes>
    </>
  )
}

export default App
