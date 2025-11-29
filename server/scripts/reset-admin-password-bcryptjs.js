// scripts/reset-admin-password-bcryptjs.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // use bcryptjs to match your model
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync-hub';
const ADMIN_EMAIL = 'admin@skillsynchub.com';
const NEW_PLAIN = 'admin123';

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {});

    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(NEW_PLAIN, salt);

    const updated = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL.toLowerCase().trim() },
      { password: hashed },
      { new: true }
    );

    if (!updated) {
      console.log('Admin user not found. You may need to create it first.');
    } else {
      console.log(`Password for ${ADMIN_EMAIL} reset to "${NEW_PLAIN}" (hashed and stored).`);
      console.log('Stored hash:', updated.password ? updated.password.substring(0, 60) : '(not shown)');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exit(1);
  }
})();
