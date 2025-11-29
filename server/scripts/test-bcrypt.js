// scripts/test-bcrypt.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust path if needed
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync-hub';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@skillsynchub.com';
    const plain = 'admin123';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.error('Admin user not found');
      process.exit(1);
    }

    console.log('Stored hash:', user.password);
    const ok = await bcrypt.compare(plain, user.password);
    console.log('bcrypt.compare result:', ok);

    // extra: show lengths to detect strange characters
    console.log('Stored hash length:', String(user.password).length);
    console.log('Plain length:', String(plain).length);

    await mongoose.disconnect();
    process.exit(ok ? 0 : 2);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
