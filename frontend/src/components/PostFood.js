import React, { useState } from 'react';
import API from '../services/api';

const PostFood = () => {
  const [formData, setFormData] = useState({ title: '', description: '', quantity: '', latitude: '', longitude: '', address: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/food', formData);
      alert('Food posted successfully');
      setFormData({ title: '', description: '', quantity: '', latitude: '', longitude: '', address: '' });
    } catch (err) {
      alert('Failed to post food');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '30px' }}>Post Food for Rescue</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Food Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity (servings)</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address (optional)</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={handleLocation} style={{ width: '100%' }}>
            Get Current Location
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Latitude: {formData.latitude}, Longitude: {formData.longitude}
          </p>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Post Food
        </button>
      </form>
    </div>
  );
};

export default PostFood;
