import { ReactNode } from "react";
interface TapButtonType{
    children?: ReactNode | string;
    isSelected?: string | boolean;
    onClick?: () => void;
    className?: string; 
}

export default function TapButton({children, isSelected, ...props }: TapButtonType){
    return <li>
        <button {...props} >{children}</button>
        </li>
}