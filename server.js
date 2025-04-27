require('dotenv').config();
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const moment = require('moment-timezone');

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const datasetRoute = require('./routes/dataset')
const graphRoute = require('./routes/graphs')
const aiRoute = require('./routes/aiInsights')
const dashboard = require('./routes/dashboard')


const app = express()
app.use(cors())
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use('/api/previews/',express.static('graphsPreview'))

connectDB()

// routes
app.use('/api/auth/',authRoute)
app.use('/api/user',userRoute)
app.use('/api/', datasetRoute)
app.use('/api/', graphRoute)
app.use('/api/', aiRoute)
app.use('/api/', dashboard)


const port = process.env.PORT || 8500


app.get('/',(req,res)=>{
    res.send('Backend is running')
})


app.listen(port,()=>{
    console.log(`Backend running on port: ${port}`)
})