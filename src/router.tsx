import { createBrowserRouter } from "react-router-dom";
import Login from "@/screens/login/Login";
import Home from "@/screens/home/Home";
import VerifyCode from "@/screens/verify/VerifyCode";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Modules from "@/screens/modules/modules";  

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <VerifyCode />,
    },
    {
        path: "/home",
        element: (
          <ProtectedRoute>
          <Home />    
          </ProtectedRoute>
        ),
    },
    {
        path: "/modules",
        element: (
          <ProtectedRoute>
            <Modules />
          </ProtectedRoute>
        ),
    },
]); 