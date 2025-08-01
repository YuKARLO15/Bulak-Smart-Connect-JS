// Save this as generate-hash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'TestPass123!'; 
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Password:', password);
  console.log('Generated hash:', hash);
}

generateHash();