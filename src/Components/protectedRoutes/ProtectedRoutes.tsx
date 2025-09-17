
import { Navigate } from "react-router-dom";


export default function ProtectedRoutes({children}: {children: any}){

    
        const token = localStorage.getItem('token');
        if(!token){

            return <Navigate replace to='/'/>
        }
  


    
    return <>{children}</>;
}