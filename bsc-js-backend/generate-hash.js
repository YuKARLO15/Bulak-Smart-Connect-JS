// Save this as generate-hash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Password:', password);
  console.log('Generated hash:', hash);
}

generateHash();