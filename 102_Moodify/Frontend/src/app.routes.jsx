import { createBrowserRouter } from "react-router";
import Register from "./features/Auth/pages/Register";
import Login from "./features/Auth/pages/Login";
import Protected from "./features/Auth/components/protected";
import Home from "./features/home/pages/Home";


export const router = createBrowserRouter([
   { 
    path: "/",
    element: <Protected><Home/></Protected>
   },
   {
    path: "/register",
    element: <Register/>    
   },
   {
    path: "/login",
    element: <Login/>
   }
])