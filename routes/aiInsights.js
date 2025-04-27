const { analyzeDataset } = require('../controllers/aiInsights')
const { protect, authorize } = require('../middleware/auth')

const router = require('express').Router()

router.get('/ai/analyze/:id',protect, authorize('user','admin'),analyzeDataset)

module.exports = router