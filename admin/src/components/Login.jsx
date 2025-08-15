import React, { useState } from "react";
import axios from 'axios'
import { backendURL } from "../App";
import { toast } from "react-toastify";



const Login = ({ setToken }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendURL + "/api/user/admin", { email, password })
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Admin Panel
                </h1>

                <form
                    onSubmit={onSubmitHandler}
                    className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white font-semibold rounded-lg shadow-md focus:outline-none cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                {/* Optional - Forgot Password */}
                <p className="mt-4 text-sm text-center text-gray-500">
                    Forgot your password?{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        Reset here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
