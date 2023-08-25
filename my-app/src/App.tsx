import './App.css'
import CategoryListPage from "./componets/category/list/CategoryListPage.tsx";
import DefaultLayout from "./componets/containers/default/DefaultLayout.tsx";
import {Route, Routes} from "react-router-dom";
import CategoryCreatePage from "./componets/category/create/CategoryCreatePage.tsx";
function App() {


  return (
    <>
        <Routes>
            <Route path={"/"} element={<DefaultLayout/>}>
                <Route index element={<CategoryListPage />} />
                <Route path={"create"} element={<CategoryCreatePage />} />
            </Route>
        </Routes>
    </>
  )
}

export default App
