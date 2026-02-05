import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../services/api';

// Component to handle map clicks for setting location
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

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
          <label>Location</label>
          <button type="button" className="btn btn-secondary" onClick={handleLocation} style={{ width: '100%', marginBottom: '10px' }}>
            📍 Get Current Location
          </button>
          <div style={{ height: '300px', marginBottom: '10px' }}>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                position={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : null}
                setPosition={(pos) => setFormData({ ...formData, latitude: pos[0].toFixed(6), longitude: pos[1].toFixed(6) })}
              />
            </MapContainer>
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Click on the map to set location or use "Get Current Location".<br />
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
