import { BrowserRouter, Routes, Route, createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/auth/pages/Feed"
import CreatePost from "./features/posts/Pages/CreatePost";

function AppRoutes() {
    return(
        <BrowserRouter>
           <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/" element={<Feed/>}/>
            <Route path="create-post" element={<CreatePost/>}/>

            


           </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes

// export const router = createBrowserRouter([
//     {
//         path: "/login",
//         element: <login/>
//     },
//     {
//         path: "/register",
//         element: <register/>
//     }
// ])