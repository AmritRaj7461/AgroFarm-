import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-3xl pt-5 pb-5 px-5 shadow-2xl border border-gray-100 max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mb-3 shadow-md">
            <User className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            icon={Lock}
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            icon={Lock}
          />

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-green-600 hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold text-md py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="mt-3 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-emerald-600 hover:text-green-700 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
};

export default Signup;
