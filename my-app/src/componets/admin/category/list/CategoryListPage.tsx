import {useEffect, useState} from "react";
import {ICategory} from "./types.ts";
import http_common from "../../../../http_common.ts";
import {Link} from "react-router-dom";
import ModalDelete from "../../../common/ModalDelete.tsx";

const CategoryListPage = () => {

    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        http_common.get<ICategory[]>(`/api/category`)
            .then(resp => {
                setData(resp.data);
            });
    }, []);

    const onHendlerDelete = async (id: number) => {
        try {
            await http_common.delete(`category/${id}`);
            setData(data.filter(x=>x.id!==id));
        }
        catch {
            console.log("Помилка видалення");
        }
    };

    const content = data.map(item => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>
                <img src={`${http_common.getUri()}/uploading/150_${item.image}`} alt={item.name}/>
            </td>
            <td>{item.description}</td>
            <td>
                <ModalDelete id={item.id} text={item.name} deleteFunc={onHendlerDelete} />
                &nbsp;&nbsp;
                <Link to={`/category/edit/${item.id}`} className="btn btn-info">
                    Змінить
                </Link>
            </td>
        </tr>
    ));
    return (
        <>
            <h1>Список категорій</h1>
            <Link to="/create" className={"btn btn-success"}>Додати</Link>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {content}
                </tbody>
            </table>
        </>
    );
}

export default CategoryListPage;

