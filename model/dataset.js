const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    datasetName: {type:String, required:true, unique:true},
    entryType:{type:String, enum:['manual','upload'], required:true},
    fileURL:{type: String,} ,   
    data:{type:String,required:true}
},{timestamps:true})

module.exports = mongoose.model('Dataset', DatasetSchema)