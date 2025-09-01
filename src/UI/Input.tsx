import { Input } from "antd";
import React from "react";


type CustomInputType = {
  value: string;
  label?: string;
  id?: string;
  name: string;
  placeholder: string;
  "data-testid"?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  status?: '' | 'error';
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputType>(
  (
  {
  value,
  label,
  name,
  type = "text",
  placeholder,
  onChange,
  onBlur,
  status,
  onClick,
  ...rest
  }, ref) => {

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {}
      {type === "password" ? (
        <Input.Password
        data-testid={rest["data-testid"] ?? name}
          value={value}
          name={name}
          id={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          onClick={onClick}
          status={status}
          ref={ref as any}
          {...rest}
        />
      ) : (
        <Input
        data-testid={rest["data-testid"] ?? name}
          value={value}
          name={name}
          id={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          status={status}
          ref={ref as any}
           {...rest}
        />
      )}
    </div>
  );
}
);
export default CustomInput;
