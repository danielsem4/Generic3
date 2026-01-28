import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/screens/login/Login";
import VerifyCode from "@/screens/verify/VerifyCode";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<VerifyCode />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
