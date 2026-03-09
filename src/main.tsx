import "./index.css";
import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

<<<<<<< HEAD
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
   path: "/patients",
   element: (
  <ProtectedRoute><Patient /></ProtectedRoute>
  ),
},
  {
    path: "/settings",
    element: <ProtectedRoute><Settings/></ProtectedRoute>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "*",
    element: <NotFound/>,
  },
]);

=======
>>>>>>> 18d19730e30dcd44cf17e75127a0ad6869e902ac
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
