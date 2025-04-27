const { protect, authorize } = require('../middleware/auth')
const { manualUpload, excelUpload, userDataset, deleteUserDatasets, datasetSelection, datasetDetails, allDatasets } = require('../controllers/dataset')
const upload = require('../middleware/upload')
const DatasetController = require('../controllers/dataset');

const router = require('express').Router()

router.post('/dataset/upload',protect, authorize('user'), upload.single('file'), excelUpload)
router.post('/dataset/manual', protect, authorize('user'), manualUpload)
router.get('/dataset/:id', protect, authorize('user'), datasetDetails)
router.get('/dataset/user/:id', protect, authorize('user'), userDataset)
router.post('/dataset/user/delete-datasets/', protect, authorize('user', 'admin'), deleteUserDatasets)
router.get('/dataset/selection/:id', protect, authorize('user'), datasetSelection)
router.get('/dataset/admin/all', protect, authorize('admin'), allDatasets)


module.exports =  router