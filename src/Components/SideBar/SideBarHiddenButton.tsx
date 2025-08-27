import type { MouseEventHandler, ReactNode } from "react";

interface ButtonProps{
    children: ReactNode,
    className?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
}

export default function SideBarHiddenButton({children, className, onClick}: ButtonProps){

    return(
        <button className={className} onClick={onClick}>{children}</button>
    );
}