// scripts/reset-admin-password.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust if path differs
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync-hub';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@skillsynchub.com';
    const newPlain = 'admin123';

    const user = await User.findOne({ email });
    if (!user) {
      console.error('Admin user not found - cannot reset');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPlain, salt);

    user.password = newHash;
    // If your schema hashes on pre-save, you can instead set user.password = newPlain and call save()
    // but here we directly set hash to be safe.
    await user.save(); // triggers pre-save only if password is changed as plain; saving hashed value is okay.

    console.log(`Password for ${email} reset to "${newPlain}" (hashed and stored).`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    process.exit(1);
  }
})();
