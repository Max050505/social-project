import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonImageProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

export default function ButtonImage({
  children,
  className = "",
  ...props
}: ButtonImageProps) {
  return <button className={className} {...props}>{children}</button>;
}
