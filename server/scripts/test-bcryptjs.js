// scripts/test-bcryptjs.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

(async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync-hub';
  await mongoose.connect(MONGO_URI, {});

  const user = await User.findOne({ email: 'admin@skillsynchub.com' }).select('+password');
  if (!user) {
    console.log('Admin not found');
    process.exit(1);
  }

  console.log('Stored hash (prefix):', user.password?.slice(0, 30));
  const ok = await bcrypt.compare('admin123', user.password);
  console.log('bcryptjs.compare result:', ok);

  await mongoose.disconnect();
})();
