const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/database');
const User = require('./models/User');
const FoodPost = require('./models/FoodPost');

dotenv.config();

const app = express();

// Connect Database and sync models
(async () => {
  await connectDB();
  await sequelize.sync();
})();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/food', require('./routes/food'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
