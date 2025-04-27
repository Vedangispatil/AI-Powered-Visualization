const { getUserPorfile, getAllUsers, updateUser, deleteUser, updateProfile,updatePassword } = require('../controllers/users')
const { protect, authorize } = require('../middleware/auth')

const router = require('express').Router()

router.get('/profile',protect, authorize('admin','user'),getUserPorfile)
router.get('/profiles',protect, authorize('admin'), getAllUsers)
router.put('/profile/:id',protect, authorize('admin'), updateProfile)
router.delete('/profile/:id',protect, authorize('admin'), deleteUser)
router.put('/update/:id',protect, authorize('admin','user'), updateUser)
router.put('/update-password/:id',protect, authorize('admin','user'), updatePassword)

router.get('/admin', protect, authorize('admin'), (req,res)=>{
    res.send('welcome admin')
})

router.get('/user', protect, authorize('user'), (req,res)=>{
    res.send('welcome user')
})

module.exports =  router