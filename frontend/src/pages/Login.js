import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router v6
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const BackendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BackendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


      if (response.ok) {
        localStorage.setItem("authToken", data.token);

        
        const user = jwtDecode(data.token);
        const { role } = user;
        // Redirect based on the role
        if (role === "Manager") {
          navigate("/dashboard");
        } else if (role === "Pantry") {
          navigate("/pantry-dashboard");
        } else if (role === "Delivery") {
          navigate("/delivery-dashboard");
        } else {
          setErrorMessage("Unknown role.");
        }
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src="https://www.kyha.com/wp-content/uploads/2024/05/food-is-medicine.webp" // Replace with your hospital logo
            alt="Hospital Logo"
            className="mx-auto w-28 h-28 object-cover rounded-full border-4 border-green-500 shadow-md"
          />
          <h2 className="mt-3 text-3xl font-extrabold text-green-700">
            Hospital Food Delivery
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Manage meals and patient diets with ease
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-bold"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-4">
          © 2025 Hospital Food Delivery
        </p>
      </div>
    </div>
  );
}

export default Login;
