// test-bcrypt.js
const bcrypt = require('bcrypt'); // or 'bcryptjs' to test alternative
const savedHash = '$2a$10$zwR63g169ooM2G1cFoxZie0k8Y3u.S1tf.CTYtrd2Q7sXTeHC3GvS'; // put the DB hash here
const plain = 'admin123';

(async () => {
  console.log('plain length:', plain.length);
  console.log('plain codes:', Array.from(plain).map(c => c.charCodeAt(0)));
  try {
    const ok = await bcrypt.compare(plain, savedHash);
    console.log('compare result:', ok);
  } catch (err) {
    console.error('bcrypt error:', err);
  }

  // sanity: re-hash same plain and compare
  const newHash = await bcrypt.hash(plain, 10);
  console.log('newHash:', newHash);
  console.log('compare new to plain:', await bcrypt.compare(plain, newHash));
})();
