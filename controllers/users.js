const User = require('../model/user')
const bcrypt = require('bcrypt')

const getUserPorfile = async (req, res) => {
    // console.log(req.user)
    try {
        const user = await User.findById(req.user.id).select('-password')
        const { _id, name, email, role, createdAt } = user
        res.json({ id: _id, name, email, role,joinDate: new Date(createdAt).toLocaleDateString('en-CA') })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -updatedAt')
        const result = users.map(data=>({id:data._id, name:data.name, email:data.email, role:data.role, joinDate: new Date(data.createdAt).toLocaleDateString('en-CA')}))
        // console.log(result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })

    }
}

const updateProfile = async(req,res)=>{
    // console.log(req.body, req.params.id)
    const {name, email, role} = req.body
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {name, email, role})
        if (!user) return res.status(406).json({ error: 'User not exists!' })
        res.send({message:'User data updated successfully.'})

    } catch (error) {
        console.log(error)
        if(error.codeName === 'DuplicateKey'){
           return res.status(400).json({ message: "Email already exists!" })
        }
        
        return res.status(400).json({ message: error.message })
    }

    //res.send('ok')
}

const updateUser = async(req,res)=>{
    // console.log(req.body, req.params.id)
    const {name, email,} = req.body
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {name, email})
        if (!user) return res.status(406).json({ error: 'User not exists!' })
        res.send({message:'User data updated successfully.'})

    } catch (error) {
        console.log(error)
        if(error.codeName === 'DuplicateKey'){
           return res.status(400).json({ message: "Email already exists!" })
        }
        
        return res.status(400).json({ message: error.message })
    }

}

const deleteUser = async(req,res) =>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.send({message:'User deleted successfully.'})
        
    } catch (error) {
        return res.status(400).json({ message: error.message })        
    }
}

const updatePassword = async(req,res)=>{
    // console.log(req.body, req.params.id)
    const {confirmNewPassword} = req.body
    try {
        const password = await bcrypt.hash(confirmNewPassword, await bcrypt.genSalt(12))
        const user = await User.findByIdAndUpdate(req.params.id, {password:password})
        // console.log(user)
        if (!user) return res.status(406).json({ error: 'User not exists!' })
        res.send({message:'User data updated successfully.'})

    } catch (error) {
        console.log(error)
       
        
        return res.status(400).json({ message: error.message })
    }

}

module.exports = { getUserPorfile, getAllUsers,updateProfile, updateUser, deleteUser,updatePassword }