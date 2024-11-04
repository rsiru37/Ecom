import './App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from './components/Signup';
import { Signin } from './components/Signin';
import { Dashboard } from './components/Dashboard';
import { ADashboard } from './components/ADashboard';
import {Payments} from "./components/Payments"
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path={"/signup"} element={<Signup />}/>
        <Route path={"/signin"} element={<Signin />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/admin-board"} element={<ADashboard />} />
        <Route path={"/pay"} element={<Payments/>}/>
      </Routes>
    </BrowserRouter>
    <h1>Welcome to Shopee App</h1>
    </>
  )
}

export default App