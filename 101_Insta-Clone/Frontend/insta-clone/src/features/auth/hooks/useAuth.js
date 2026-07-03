import { useContext } from "react";
import { AuthContext } from "../auth.context";



export function useAuth() {

    const context = useContext(AuthContext)

    return context
    
}


//Hooks is the toolbox and useAuth.js is one of the tool inside this toolbox 

// Think of AuthContext as a shared storage box.

//                AuthContext
//         ┌─────────────────────────┐
//         │                         │
//         │ user                    │
//         │ loading                 │
//         │ handleLogin             │
//         │ handleLogout            │
//         │ ...                     │
//         └─────────────────────────┘

// What does useContext(AuthContext) do?

// It says:

// "Go to the AuthContext and give me everything stored inside it."