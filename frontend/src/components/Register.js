import React, { useState } from 'react';
import API from '../services/api';

const Register = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', latitude: '', longitude: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          setLocationLoading(false);
        },
        (error) => {
          setErrors({ location: 'Unable to get location. Please try again.' });
          setLocationLoading(false);
        }
      );
    } else {
      setErrors({ location: 'Geolocation is not supported by this browser.' });
    }
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
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setSuccessMessage('Registration successful! Welcome aboard!');
    } catch (err) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '30px' }}>Join FoodShare</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errors.general && <div className="error-message">{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Choose a username"
              required
            />
          </div>
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              required
            />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label>Location (Optional)</label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLocation}
            disabled={locationLoading}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            {locationLoading ? 'Getting location...' : '📍 Get My Location'}
          </button>
          {errors.location && <span className="field-error">{errors.location}</span>}
          {(formData.latitude || formData.longitude) && (
            <div className="location-display">
              <strong>📍 Your Location:</strong><br />
              Latitude: {formData.latitude}<br />
              Longitude: {formData.longitude}
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
          {isLoading ? 'Creating account...' : '🚀 Join FoodShare'}
        </button>
      </form>
    </div>
  );
};

export default Register;
