import { useNavigate } from "react-router-dom";
import { ICategoryCreate } from "./types.ts";
import { useFormik } from "formik";
import http_common from "../../../../http_common.ts";
import { ChangeEvent } from "react";
import defaultImage from '../../../../assets/default-image.jpg';

const CategoryCreatePage = () => {
    const navigate = useNavigate();

    const init: ICategoryCreate = {
        name: "",
        image: null,
        description: ""
    };

    const onFormikSubmit = async (values: ICategoryCreate) => {
        try {
            await http_common.post(`/api/category`, values, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("..");
        }
        catch {
            console.log("Server error");
        }
    }

    const formik = useFormik({
        initialValues: init,
        onSubmit: onFormikSubmit
    });

    const {values, handleChange, handleSubmit, setFieldValue } = formik;

    const onChangeFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(files)
        {
            const file = files[0];
            if(file) {
                //Перевірка на тип обраного файлу - допустимий тип jpeg, png, gif
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
                if (!allowedTypes.includes(file.type)) {
                    alert("Не допустимий тип файлу");
                    return;
                }
                setFieldValue(e.target.name, file);
            }
        }
    }

    return (
        <>
            <h1 className="text-center">Додати категорію</h1>
            <div className="container">
                <form className="col-md-8 offset-md-2" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Назва</label>
                        <input type="text" className="form-control" id="name"
                               value={values.name}
                               onChange={handleChange}
                               name="name"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                            <img src={values.image==null ? defaultImage: URL.createObjectURL(values.image)}
                                 alt="фото"
                                 width={200}
                                 style={{cursor: "pointer"}}/>
                        </label>
                        <input type="file" className="form-control d-none" id="image"
                               onChange={onChangeFileHandler}
                               name="image"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Опис</label>
                        <input type="text" className="form-control" id="description"
                               value={values.description}
                               onChange={handleChange}
                               name="description"/>
                    </div>

                    <button type="submit" className="btn btn-primary">Додати</button>
                </form>
            </div>
        </>
    );
};

export default CategoryCreatePage;
