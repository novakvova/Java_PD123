import {ICategoryCreate} from "./types.ts";
import http_common from "../../../http_common.ts";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useState} from "react";


const CategoryCreatePage = () => {
    const navigate = useNavigate();
    const init: ICategoryCreate = {
        name: "",
        image: "",
        description: ""
    };
    const [data, setData] = useState<ICategoryCreate>(init);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        http_common.post("/category", data)
            .then(() => {
                navigate("/");
            })
            .catch(error => {
                console.error("Error adding person:", error);
            });
    };

    const onChangeHandler = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    return (
        <>
            <h1>Додати категорію</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name"
                       name={"name"}
                       value={data.name}
                       onChange={onChangeHandler} />

                <input type="text" placeholder="Image URL"
                       name={"image"}
                       value={data.image}
                       onChange={onChangeHandler} />

                <input type="text" placeholder="Description"
                       name={"description"}
                       value={data.description}
                       onChange={onChangeHandler} />

                <button type="submit">Додати</button>
            </form>


        </>
    );
}
export default CategoryCreatePage;
