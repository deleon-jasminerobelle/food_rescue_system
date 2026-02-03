const express = require('express');
const FoodPost = require('../models/FoodPost');
const auth = require('../middleware/auth');

const router = express.Router();

// Post food
router.post('/', auth, async (req, res) => {
  const { title, description, quantity, latitude, longitude, address } = req.body;
  try {
    const foodPost = new FoodPost({
      title,
      description,
      quantity,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      address,
      postedBy: req.user.id,
    });
    await foodPost.save();
    res.json(foodPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby food posts
router.get('/nearby', auth, async (req, res) => {
  const { latitude, longitude, maxDistance = 10000 } = req.query; // maxDistance in meters
  try {
    const foodPosts = await FoodPost.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      status: 'available',
    }).populate('postedBy', 'username');
    res.json(foodPosts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim food
router.put('/:id/claim', auth, async (req, res) => {
  try {
    const foodPost = await FoodPost.findById(req.params.id);
    if (!foodPost || foodPost.status !== 'available') {
      return res.status(400).json({ message: 'Food not available' });
    }
    foodPost.claimedBy = req.user.id;
    foodPost.status = 'claimed';
    await foodPost.save();
    res.json(foodPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Donate more (update quantity)
router.put('/:id/donate', auth, async (req, res) => {
  const { additionalQuantity } = req.body;
  try {
    const foodPost = await FoodPost.findById(req.params.id);
    if (!foodPost) {
      return res.status(404).json({ message: 'Food post not found' });
    }
    foodPost.quantity += additionalQuantity;
    await foodPost.save();
    res.json(foodPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
