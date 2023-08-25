import {useEffect, useState} from "react";
import {ICategory} from "./types.ts";
import http_common from "../../../http_common.ts";
import {Link} from "react-router-dom";

const CategoryListPage = () => {

    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        http_common.get<ICategory[]>(`/`)
            .then(resp => {
                setData(resp.data);
            });
    }, []);

    const content = data.map(item => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.image}</td>
            <td>{item.description}</td>
            <td>
                {/*<button onClick={() => setEditingPerson(person)}>Edit</button>*/}
                {/*<button onClick={() => handleDeletePerson(person.id)}>Delete</button>*/}
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

