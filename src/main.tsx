import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import Home from './screens/home/Home.tsx';
import Login from './screens/login/Login.tsx';
import NotFound from './screens/not-found/NotFound.tsx';
import ErrorPage from './screens/error/ErrorPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home/></ProtectedRoute>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "*",
    element: <NotFound/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
