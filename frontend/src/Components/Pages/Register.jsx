import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile_number: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Mobile number validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!phoneRegex.test(formData.mobile_number)) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number";
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
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        // Redirect to login page
        navigate('/login');
      } else {
        setErrors({ server: data.error || "Registration failed" });
      }
    } catch (err) {
      setErrors({ server: "Something went wrong. Please try again." });
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
        className="p-8 rounded shadow font-poppins text-white w-96"
        style={{ backgroundColor: "#FF5722" }}
      >
        <h1 className="text-3xl mb-6 text-center">Register</h1>
        
        {errors.server && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">
            {errors.server}
          </div>
        )}
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="p-2 rounded text-black w-full"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-xs mt-1 text-red-100">{errors.username}</p>
            )}
          </div>
          
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
          
          <div>
            <input
              type="tel"
              name="mobile_number"
              placeholder="Mobile Number"
              className="p-2 rounded text-black w-full"
              value={formData.mobile_number}
              onChange={handleChange}
            />
            {errors.mobile_number && (
              <p className="text-xs mt-1 text-red-100">{errors.mobile_number}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-black">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;