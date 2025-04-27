const Dataset = require("../model/dataset")
const xlsx = require('xlsx')
const path = require('path')
const fs = require('fs')
const User = require("../model/user")
const Graph = require("../model/graphs")

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // `getTime()` returns NaN if the date is invalid
}

const manualUpload = async (req, res) => {
    try {
        const { userId, name, manualData } = req.body
        const checkDatasetName = await dataset.find({datasetName:name})
        if(checkDatasetName.length!==0){
           
            return res.status(400).json({ message: 'Dataset name already exists!' })
        }
        if (manualData.length === 0) return res.status(400).json({ 'message': 'No data uploaded!' })
        if (Object.keys(manualData[0]).length > 8) return res.status(400).json({ 'message': 'Max 8 columns are allowed!' })
        const data = new dataset({ userId, datasetName: name, data: JSON.stringify(manualData), entryType:'manual' })
        await data.save()
        res.status(201).json({message:'Dataset added successfully.'})

    } catch (error) {
        console.log('error', error.codeName)
        return res.status(400).json({ message: error.message })

    }


}

const excelUpload = async(req, res) => {
    try {

        if(req.isFileNotSupported)  return res.status(400).json({ message: 'File format not supported' })
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
        // console.log(req.file)
        const { userId, name} = req.body
        const filePath =  req.file.path

        const checkDatasetName = await dataset.find({datasetName:name})
        if(checkDatasetName.length!==0){
            fs.rmSync(filePath, { force: true })
            return res.status(400).json({ message: 'Dataset name already exists!' })
        }
        
        

        const workBook = xlsx.readFile(filePath,{ cellText: false,cellDates: true })
        const sheetName = workBook.SheetNames[0]
        const sheetData = xlsx.utils.sheet_to_json(workBook.Sheets[sheetName],{cellText: false,  dateNF: 'dd/mm/yyyy'})
        const clearData = sheetData.map(data=>{
            const newObj = {}
            Object.keys(data).forEach(column=>{
                if(typeof(data[column]) !== 'number' && isValidDate(data[column])){
                    const existingDate = new Date(data[column]);  // For example, it could be '2024-10-06'
                    existingDate.setDate(existingDate.getDate() + 1);
                    newObj[column] = existingDate.toLocaleDateString('en-GB')
                }
                else{
                    newObj[column] = data[column]
                }
            })
            return newObj
        })
        // console.log(clearData)
        // console.log(sheetData)

        if (sheetData.length === 0) {
            fs.rmSync(filePath, { force: true })
            return res.status(400).json({ message: 'Excel sheet is empty' })
        }
        const excelCol = Object.keys(sheetData[0])
        if(excelCol.length>8){
            fs.rmSync(filePath, { force: true })
            return res.status(400).json({ message: 'Max 8 columns are allowed in excel sheet' })
        }
        const data = new dataset({ userId, datasetName: name, data: JSON.stringify(clearData), fileURL:filePath, entryType:'upload' })
        await data.save()
        res.status(201).json({message:'Dataset added successfully.'})
        
    } catch (error) {
        console.error('Error proccessiong files', error)
        res.status(500).json({ message: 'error proccessing excel file', error: error.message })
    }

}

const userDataset = async(req, res)=>{
    try {
        const id = req.params.id
        const datasetData = await dataset.find({userId:id}).select('-filePath -userId -fileURL -updatedAt').sort({createdAt: -1})
        //console.log(datasetData)
        return res.send(datasetData.map(row=>({id:row._id, datasetName:row.datasetName, entryType:row.entryType, data:row.data, createdAt:new Date(row.createdAt).toLocaleDateString('en-GB')})))
    
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}
const deleteUserDatasets = async(req, res)=>{
    try {
        const {selectedRows} = req.body
        await dataset.deleteMany({_id:{$in: selectedRows}})
        await graphs.deleteMany({datasetId:{$in:selectedRows}})
        
        res.status(200).json({message:'Datasets deleted successfully'})        
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}

const datasetSelection = async(req, res)=>{
    try {
        const id = req.params.id
        const datasetData = await dataset.find({userId:id}).select('-filePath -userId -fileURL -updatedAt -entryType -data -createdAt').sort({createdAt: -1})
        //console.log(datasetData)
        res.send(datasetData.map(row=>({datasetId:row._id, datasetName:row.datasetName,})))

        
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}
const datasetDetails = async(req, res)=>{
    try {
        const id = req.params.id
        const datasetData = await dataset.findById(id).select('-_id -__v -datasetName -filePath -userId -fileURL -updatedAt -entryType -createdAt')
        //console.log(datasetData)
        res.send(datasetData)

        
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}

const allDatasets = async(req, res)=>{
    try {
        const datasetData = await dataset.find({}).select('-filePath -fileURL -updatedAt').sort({createdAt: -1})
        const userIds = datasetData.map(data=>data.userId)
        const userData = await user.find({_id:{$in:userIds}},{name:1, email:1})
        const userInfo = {}
        userData.forEach(user=>{
            userInfo[user._id] = {name:user.name, email:user.email}

        })
        // console.log(userInfo)
        return res.send(datasetData.map(row=>({id:row._id, userInfo: userInfo[row.userId] ,datasetName:row.datasetName, entryType:row.entryType, data:row.data,})))
    
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}





module.exports = { manualUpload, excelUpload, userDataset, deleteUserDatasets, datasetSelection, datasetDetails, allDatasets }