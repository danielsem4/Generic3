import { createBrowserRouter } from "react-router-dom";
import Login from "@/screens/login/Login";
import VerifyCode from "@/screens/verify/VerifyCode";
import Home from "@/screens/home/Home";
import Modules from "@/screens/modules/modules";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import Settings from "@/screens/settings/Settings";
import NotFound from "@/screens/not-found/NotFound";
import Patient from "@/screens/patient/Patient";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/verify", element: <VerifyCode /> },

  {
    element: <ProtectedLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "modules", element: <Modules /> },
      { path: "settings", element: <Settings /> },
      { path: "patient", element: <Patient /> },
    ],
  },
  {
<<<<<<< HEAD
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
     path: "/patients", 
     element: (
    <ProtectedRoute>
      <Patient />
    </ProtectedRoute>
  ),
},
]); 
=======
    path: "*",
    element: <NotFound />,
  },
]);
>>>>>>> 18d19730e30dcd44cf17e75127a0ad6869e902ac
