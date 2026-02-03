const mongoose = require('mongoose');

const foodPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
  address: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available', 'claimed'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
});

foodPostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FoodPost', foodPostSchema);
