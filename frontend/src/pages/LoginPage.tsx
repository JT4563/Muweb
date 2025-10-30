import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCode, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useAuthStore } from "../stores/authStore";
import "../styles/AuthPage.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isLogin) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Store in auth store
      authStore.setUser(data.user);
      authStore.setTokens(data.tokens.accessToken, data.tokens.refreshToken);

      // Also store in localStorage for API calls
      localStorage.setItem("authToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate to editor
      navigate("/editor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password length
    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      const data: LoginResponse = await response.json();

      // Store in auth store
      authStore.setUser(data.user);
      authStore.setTokens(data.tokens.accessToken, data.tokens.refreshToken);

      // Also store in localStorage for API calls
      localStorage.setItem("authToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate to editor
      navigate("/editor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <FaCode className="logo-icon" />
            <h1>CodeCrafter</h1>
          </div>
          <p className="auth-subtitle">Collaborative Code Execution Platform</p>
        </div>

        {/* Form */}
        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          className="auth-form"
        >
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <>
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-button"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={signupData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={signupData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">
                  <FaUser /> Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={signupData.username}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">
                  <FaEnvelope /> Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">
                  <FaLock /> Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                />
                <small>Minimum 8 characters</small>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-button"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </>
          )}

          {/* Toggle Button */}
          <div className="toggle-auth">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ email: "", password: "" });
                  setSignupData({
                    email: "",
                    password: "",
                    username: "",
                    firstName: "",
                    lastName: "",
                  });
                }}
                className="toggle-link"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Built with <span className="heart">❤️</span> for developers
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
