import {ICategoryCreate} from "./types.ts";
import http_common from "../../../http_common.ts";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useState} from "react";


const CategoryCreatePage = () => {
    const navigate = useNavigate();
    const init: ICategoryCreate = {
        name: "",
        image: null,
        description: ""
    };
    const [data, setData] = useState<ICategoryCreate>(init);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement> ) => {
        const {target} = e;
        const {files} = target;
        if(files) {
            const file = files[0];
            setData({...data, image: file});
        }
        target.value="";
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        http_common.post("/category", data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(() => {
                navigate("/");
            })
            .catch(error => {
                console.error("Error adding category:", error);
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

                <input type="file" placeholder="Image URL"
                       name={"image"}
                       onChange={handleFileChange} />

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
