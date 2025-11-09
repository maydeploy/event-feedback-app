import bcrypt from 'bcrypt'

// Admin authentication middleware
export function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next()
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Admin access required.',
  })
}

// Verify admin password
export async function verifyAdminPassword(password) {
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminPasswordHash) {
    throw new Error('ADMIN_PASSWORD_HASH not configured')
  }

  return await bcrypt.compare(password, adminPasswordHash)
}

// Helper to hash a password (for setup)
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}
