import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    type?: "text"|"password"|"email"|"number",   //може не передаватися у пропсах для компонента(| - один із можливих варіатнів, які можуть буть)
    field: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    errors?: string[],
    error?: string|undefined,
    touched?: boolean|undefined
}

const InputGroup : FC<InputGroupProps> = ({
                                              label,
                                              type="text", //Якщо не передає значення у type - то буде "text"
                                              field,
                                              value,
                                              onChange,
                                              errors,
                                              error,
                                              touched
                                          }) => {
    return (
        <div className="mb-3">
            <label htmlFor={field} className="form-label">
                {label}
            </label>
            <input
                type={type}
                className={classNames("form-control", {
                    "is-invalid": errors||(error&&touched)
                })}
                id={field}
                name={field}
                value={value}
                onChange={onChange}
                aria-describedby="emailHelp"
            />
            {errors && (
                <div id="validationServerUsernameFeedback" className="invalid-feedback">
                    {errors.map((err, index) => (
                        <span key={index}>{err}</span>
                    ))}
                </div>
            )}
            {(error&&touched) && (
                <div id="validationServerUsernameFeedback" className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};

export default InputGroup;
