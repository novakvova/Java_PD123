import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ICategory} from "../../category/list/types.ts";
import http_common from "../../../../http_common.ts";
import {IProductCreate} from "./types.ts";
import * as yup from "yup";
import {useFormik} from "formik";
import InputGroup from "../../../common/InputGroup.tsx";
import classNames from "classnames";
import EditorTiny from "../../../common/EditorTiny";

const ProductCreatePage = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<ICategory[]>([]);
    useEffect(() =>{
        http_common.get<ICategory[]>(`/`)
            .then(resp => {
                setCategories(resp.data);
            });
    },[]);

    const init: IProductCreate = {
      name: "",
      categoryId: 0,
      description: "",
      files: []
    };

    const onFormikSubmit = async (values: IProductCreate) => {
        console.log("Formik submit: ", values);
    }

    //Схема валідації даних
    const validSchema = yup.object({
       name: yup.string().required("Вкажіть назву"),
       description: yup.string().required("Вкажіть опис"),
       categoryId: yup.number().min(1,"Вкажіть категорію"),
       files: yup
           .array()
           .of(yup.object())
           .min(1,"Кількість фото товару мін 1")
           .required("Оберіть хочаб одне фото")
    });

    const formik = useFormik({
       initialValues: init,
       onSubmit: onFormikSubmit,
       validationSchema: validSchema
    });

    const {
        values,
        touched,
        errors,
        handleSubmit,
        handleChange,
        setFieldValue
    } = formik;



    return (
        <>
            <h1 className={"text-center"}>Додати продукт</h1>
            <form onSubmit={handleSubmit} className={"col-md-10 offset-md-1"}>
                <InputGroup
                    label="Назва"
                    field="name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                    touched={touched.name}
                />

                <div className="mb-3">
                    <label htmlFor="categoryId" className="form-label">
                        Оберіть категорію
                    </label>
                    {/* Select - містить у собі значення категорій, по default - 0 */}
                    <select
                        className={classNames("form-select", {
                            "is-invalid": errors.categoryId && touched.categoryId,
                        })}
                        defaultValue={values.categoryId} //Значення, яке міститься в select
                        aria-label="Default select example"
                        onChange={handleChange} //якщо значення міняється, воно записується у формік
                        name="categoryId" //значення поля у форміку = categoryId - якщо його не буде - formik - не буде знать, яке поле оновлять
                        id="categoryid" //це використовується для label
                    >
                        {/* значення, яке завжди буде не обране, для того, що нагадать, що треба
            вказувать категорію */}
                        <option value="0" disabled>
                            Оберіть категорію
                        </option>
                        {/* Перебираємо список категорій і виводимо їз у вигляд <option></option> */}
                        {categories.map((item) => {
                            return (
                                <option value={item.id} key={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/*<InputGroup*/}
                {/*    label="Опис"*/}
                {/*    field="description"*/}
                {/*    value={values.description}*/}
                {/*    onChange={handleChange}*/}
                {/*    error={errors.description}*/}
                {/*    touched={touched.description}*/}
                {/*/>*/}
                {/* Використовує наш компонент для вводу опису, який формується за допомогою TinyMCE */}
                <EditorTiny
                    value={values.description} //Значення, яке ми вводимо в поле
                    label="Опис" //Підпис для даного інпуту
                    field="description" //Назва інпуту
                    error={errors.description} //Якщо є помилка, то вона буде передаватися
                    touched={touched.description} //Якщо натискалася кнопка Submit
                    onEditorChange={(text: string) => {
                        //Метод, який викликає сам компонет, коли в інпуті змінюється значення
                        setFieldValue("description", text); //Текст, який в середині інпуту, записуємо у формік в поле description
                    }}
                />

                <button type="submit" className="btn btn-primary">
                    Створити товар
                </button>
            </form>

        </>
    )
}

export default ProductCreatePage;
