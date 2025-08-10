import { Input } from "antd";

type CustomInputType = {
  value: string;
  label?: string;
  id?: string;
  name: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  status?: '' | 'error';
};

const CustomInput: React.FC<CustomInputType> = ({
  value,
  label,
  name,
  type = "text",
  placeholder,
  onChange,
  onBlur,
  status,
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {}
      {type === "password" ? (
        <Input.Password
          value={value}
          name={name}
          id={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          status={status}
        />
      ) : (
        <Input
          value={value}
          name={name}
          id={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          status={status}
        />
      )}
    </div>
  );
};

export default CustomInput;
