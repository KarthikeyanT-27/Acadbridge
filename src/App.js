import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Studentportal from "./components/Studentportal";
import Staffportal from "./components/Staffportal";
import Adminportal from "./components/Adminportal";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/student" element={<Studentportal />} />
                <Route path="/staff" element={<Staffportal />} />
                <Route path="/admin" element={<Adminportal />} />
               
            </Routes>
        </Router>
    );
}

export default App;
