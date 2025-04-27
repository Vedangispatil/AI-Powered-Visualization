const { createGraph, userAllGraphs, graphDetails, allGraphs, deleteGraphs } = require('../controllers/graphs')
const { protect, authorize } = require('../middleware/auth')

const router = require('express').Router()

router.post('/graph/create',protect, authorize('user'),createGraph)
router.get('/graph/:id',protect, authorize('user','admin'),graphDetails)
router.get('/graph/user/:id',protect, authorize('user'),userAllGraphs)
router.get('/graph/admin/all',protect, authorize('admin'),allGraphs)
router.post('/graph/delete-graphs/',protect, authorize('user','admin'),deleteGraphs)

module.exports = router