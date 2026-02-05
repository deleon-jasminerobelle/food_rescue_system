import React, { useState } from 'react';
import API from '../services/api';
import './Register.css';

const Login = ({ setToken, setView }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setSuccessMessage('Login successful!');
    } catch (err) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="brand-section">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1V4c0 .55.45 1 1 1s1-.45 1-1V4h1c1.1 0 2 .9 2 2z"/>
              <path d="M16 6h2v10h-2V6z"/>
              <path d="M18 18h-2v2h2v-2z"/>
              <path d="M16 6h2v10h-2V6z"/>
              <path d="M18 18h-2v2h2v-2z"/>
            </svg>
          </div>
          <h1 className="brand-title">FoodShare</h1>
        </div>

        <div className="form-section">
          {successMessage && (
            <div className="status-message success">
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="status-message error">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="input-block">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`modern-input ${errors.email ? 'has-error' : ''}`}
                placeholder=" "
                autoComplete="email"
                disabled={isLoading}
              />
              <label htmlFor="email" className="modern-label">Email</label>
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>

            <div className="input-block">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`modern-input ${errors.password ? 'has-error' : ''}`}
                placeholder=" "
                autoComplete="current-password"
                disabled={isLoading}
              />
              <label htmlFor="password" className="modern-label">Password</label>
              <button
                type="button"
                className="input-suffix"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={isLoading}
            >
              <span className="btn-text">
                {isLoading ? 'Logging in...' : 'Sign In'}
              </span>
              {!isLoading && <span className="btn-arrow">→</span>}
            </button>
          </form>

          <div className="auth-switch">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="switch-btn"
              onClick={() => setView('register')}
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
