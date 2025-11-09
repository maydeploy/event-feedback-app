import bcrypt from 'bcrypt'

// Utility script to hash admin password
// Usage: node src/utils/hashPassword.js your_password

const password = process.argv[2]

if (!password) {
  console.error('Please provide a password as an argument')
  console.error('Usage: node src/utils/hashPassword.js your_password')
  process.exit(1)
}

async function hash() {
  const hashed = await bcrypt.hash(password, 10)
  console.log('\nYour hashed password:')
  console.log(hashed)
  console.log('\nAdd this to your .env file as ADMIN_PASSWORD_HASH')
}

hash()
