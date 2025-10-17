import { ReactNode } from "react";
interface ButtonType{
    children?: ReactNode | string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export default function AcceptAndCancelButton({children, ...props }: ButtonType){
    return  <button {...props} >{children}</button>

}