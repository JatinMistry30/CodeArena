import React, { useState } from "react";
import axios from 'axios'
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
  
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await axios.post(
      "https://codearena-u4dp.onrender.com/api/login",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (res.status === 200) {
      window.location.href = "/dashboard";
    } else {
      setErrors({ server: res.data.error || "Login failed" });
    }
  } catch (err) {
    const serverError = err.response?.data?.error || "Something went wrong. Please try again.";
    setErrors({ server: serverError });
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ backgroundColor: "#121212" }}
    >
      <div
        className="p-8 rounded shadow font-poppins text-white w-80"
        style={{ backgroundColor: "#FF5722" }}
      >
        <h1 className="text-3xl mb-6 text-center">Login</h1>
        
        {errors.server && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">
            {errors.server}
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 rounded text-black w-full"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-xs mt-1 text-red-100">{errors.email}</p>
            )}
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2 rounded text-black w-full"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-xs mt-1 text-red-100">{errors.password}</p>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </div>
        
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="underline hover:text-black">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;