import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { email, password });
            
            if (response.data.user) {
                alert("Login successfully");
                setUser(response.data.user);  // Set user state without using JWT
                
                if (response.data.user.role === "doctor") {
                    navigate("/dashboard/doctor");
                } else {
                    navigate("/dashboard/patient");
                }
            } else {
                alert("Invalid login credentials");
            }
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-cyan-900">
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4 text-white">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="off"
                    />
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="new-password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <Link to="/forgot-password" className="text-blue-500">Forgot Password?</Link>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <div className="text-center text-white">
                        Don't have an account? 
                        <Link to='/register' className="m-3 text-blue-500">Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
