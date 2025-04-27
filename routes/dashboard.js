const { adminDashboard } = require('../controllers/dashboard')
const { protect, authorize } = require('../middleware/auth')

const router = require('express').Router()

router.get('/dashbord',protect, authorize('admin'),adminDashboard)

module.exports = router