import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import Home from './screens/home/Home.tsx';
import Login from './screens/login/Login.tsx';
import VerifyCode from './screens/verify/VerifyCode.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/verify",
    element: <VerifyCode/>,
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home/></ProtectedRoute>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
