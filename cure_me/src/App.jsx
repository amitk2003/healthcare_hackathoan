import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./component/dashboard";
import Register from "./component/Register";
import Login from "./component/Login";
import { StickyNavbar } from "./component/StickyNavbar";
import Carousel from "./component/Carousel"
import Home from "./component/Home"
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
    
     
    
    {/* <div>
      <VideoCarousel />
    </div> */}
 
    
    <Router>
    <StickyNavbar/>
    <Carousel/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based Dashboard Routes */}
        <Route
          path="/dashboard/patient"
          element={user?.role === "patient" ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/doctor"
          element={user?.role === "doctor" ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />

        {/* Redirect "/dashboard" to the correct role-based dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "doctor" ? <Navigate to="/dashboard/doctor" /> : <Navigate to="/dashboard/patient" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
    </>
  );
}
