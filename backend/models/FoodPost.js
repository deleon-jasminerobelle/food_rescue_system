const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const FoodPost = sequelize.define('FoodPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    defaultValue: 0,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    defaultValue: 0,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  claimedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('available', 'claimed'),
    defaultValue: 'available',
  },
}, {
  tableName: 'food_posts',
  timestamps: true,
});

// Define associations
FoodPost.belongsTo(User, { foreignKey: 'postedBy', as: 'poster' });
FoodPost.belongsTo(User, { foreignKey: 'claimedBy', as: 'claimer' });
User.hasMany(FoodPost, { foreignKey: 'postedBy', as: 'postedFoods' });
User.hasMany(FoodPost, { foreignKey: 'claimedBy', as: 'claimedFoods' });

module.exports = FoodPost;
