const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

mongoose.connect('mongodb://127.0.0.1:27017/skillsync-hub')
  .then(async () => {
    console.log("Connected");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("admin123", salt);

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@skillsynchub.com",
      password: hashed,
      role: "admin"
    });

    console.log("Admin created:");
    console.log(admin);
    process.exit();
  })
  .catch(err => console.error(err));
