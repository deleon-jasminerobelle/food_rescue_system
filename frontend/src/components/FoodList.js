import React, { useState, useEffect } from 'react';
import API from '../services/api';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchFoods(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const fetchFoods = async (lat, lng) => {
    try {
      const res = await API.get(`/food/nearby?latitude=${lat}&longitude=${lng}`);
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to fetch foods');
    }
  };

  const claimFood = async (id) => {
    try {
      await API.put(`/food/${id}/claim`);
      alert('Food claimed successfully');
      fetchFoods(location.latitude, location.longitude);
    } catch (err) {
      alert('Failed to claim food');
    }
  };

  const donateMore = async (id) => {
    const quantity = prompt('Enter additional quantity to donate:');
    if (quantity && parseInt(quantity) > 0) {
      try {
        await API.put(`/food/${id}/donate`, { additionalQuantity: parseInt(quantity) });
        alert('Donation added successfully');
        fetchFoods(location.latitude, location.longitude);
      } catch (err) {
        alert('Failed to donate');
      }
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#28a745', marginBottom: '30px' }}>Nearby Available Food</h2>
      {foods.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No nearby food available at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="grid">
          {foods.map((food) => (
            <div key={food._id} className="card">
              <h3>{food.title}</h3>
              <p><strong>Description:</strong> {food.description}</p>
              <p><strong>Quantity:</strong> {food.quantity} servings</p>
              <p><strong>Address:</strong> {food.address || 'Not specified'}</p>
              <p><strong>Posted by:</strong> {food.postedBy.username}</p>
              <p><strong>Posted:</strong> {new Date(food.createdAt).toLocaleDateString()}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button className="btn btn-primary" onClick={() => claimFood(food._id)} style={{ flex: 1 }}>
                  Claim Food
                </button>
                <button className="btn btn-secondary" onClick={() => donateMore(food._id)} style={{ flex: 1 }}>
                  Donate More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodList;
