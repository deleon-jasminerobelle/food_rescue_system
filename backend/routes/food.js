const express = require('express');
const { Op } = require('sequelize');
const FoodPost = require('../models/FoodPost');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate distance between two points using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c * 1000; // Convert to meters
  return distance;
}

// Post food
router.post('/', auth, async (req, res) => {
  const { title, description, quantity, latitude, longitude, address } = req.body;
  try {
    const foodPost = await FoodPost.create({
      title,
      description,
      quantity,
      latitude: latitude || 0,
      longitude: longitude || 0,
      address,
      postedBy: req.user.id,
    });
    res.json(foodPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby food posts
router.get('/nearby', auth, async (req, res) => {
  const { latitude, longitude, maxDistance = 10000 } = req.query; // maxDistance in meters
  try {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const maxDist = parseInt(maxDistance);

    // Get all available food posts
    const foodPosts = await FoodPost.findAll({
      where: { status: 'available' },
      include: [{
        model: User,
        as: 'poster',
        attributes: ['username']
      }]
    });

    // Filter by distance
    const nearbyPosts = foodPosts.filter(post => {
      const distance = getDistance(userLat, userLon, parseFloat(post.latitude), parseFloat(post.longitude));
      return distance <= maxDist;
    });

    res.json(nearbyPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim food
router.put('/:id/claim', auth, async (req, res) => {
  try {
    const foodPost = await FoodPost.findByPk(req.params.id);
    if (!foodPost || foodPost.status !== 'available') {
      return res.status(400).json({ message: 'Food not available' });
    }
    foodPost.claimedBy = req.user.id;
    foodPost.status = 'claimed';
    await foodPost.save();
    res.json(foodPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Donate more (update quantity)
router.put('/:id/donate', auth, async (req, res) => {
  const { additionalQuantity } = req.body;
  try {
    const foodPost = await FoodPost.findByPk(req.params.id);
    if (!foodPost) {
      return res.status(404).json({ message: 'Food post not found' });
    }
    foodPost.quantity += additionalQuantity;
    await foodPost.save();
    res.json(foodPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
