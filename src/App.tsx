import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/screens/login/Login"
import VerifyCode from "@/screens/verify/VerifyCode"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<VerifyCode />} />
      </Routes>
    </BrowserRouter>
  )
}
