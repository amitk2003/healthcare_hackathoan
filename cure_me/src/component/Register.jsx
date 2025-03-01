import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
// import { FcGoogle } from "react-icons/fc";
// const handleGoogleSignIn = () => {
//     window.location.href = "http://127.0.0.1:5000/auth/google";
//   };


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");


  const handleRegister = async (e) => {
    const navigate=useNavigate();
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/register", { email, password, role });
      alert("Registration successful");
      navigate("/login")
    } catch (error) {
      alert("Registration failed");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-red p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="off"/>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="new-password"/>
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500">{showPassword ? "Hide" : "Show"}</button>
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)}  
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Register</button>
          {/* <button type="button" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center bg-white border py-2 rounded-lg shadow hover:bg-gray-200"> */}
            {/* <FcGoogle className="mr-2" /> Sign up with Google
          </button> */}
          <button>
          Do you have an account?
          <Link to='/login' className='m-3 btn btn-danger'>Sign-in</Link>

          </button>
          
        </form>
      </div>
    </div>
  )
}
