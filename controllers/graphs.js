const fs = require('fs')
const path = require('path');
const Graph = require('../model/graphs');
const dataset = require('../model/dataset');
const user = require('../model/user');

const createGraph = async (req, res) => {
    try {

        const { datasetId, graphType, graphConfig, graphPreview } = req.body
        const base64Data = graphPreview.replace(/^data:image\/\w+;base64,/, '');
        const imageName = 'file-' + Date.now() + '.png'
        const imagePath = path.join(__dirname, '../graphsPreview', imageName)
        fs.writeFile(imagePath, base64Data, 'base64', (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ messege: 'Error saving the preview.' });
            }

        });
        // console.log(graphConfig)
        const newGraph = new Graph({ datasetId, graphType, graphConfig, graphPreview: "previews/" + imageName })
        await newGraph.save()
        return res.status(201).json({ message: 'Graph saved successfully.' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });

    }

}

const userAllGraphs = async (req, res) => {
    try {
        const userId = req.params.id
        const userDatasets = await dataset.find({ userId: userId }, { _id: 1 })
        const userGraphs = await Graph.find({ datasetId: { $in: userDatasets.map(dataset => dataset._id) } }).select('-__v -updatedAt').sort({ createdAt: -1 })
        //console.log('userGraphs',userGraphs)
        return res.status(200).json(userGraphs)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });

    }
}

const graphDetails = async (req, res) => {
    try {
        const graphId = req.params.id
        const userGraphs = await Graph.find({ _id: graphId }).select('-__v -updatedAt -createdAt -graphPreview')
        if (userGraphs.length === 0) return res.status(400).json({ message: "Graph doesn't exists!" })
        const graphInfo = userGraphs[0]
        const userDatasets = await dataset.find({ _id: graphInfo.datasetId }, { _id: 1, userId: 1, data: 1 })
        if (userDatasets.length === 0) return res.status(400).json({ message: "Dataset doesn't exists!" })
        const datasetInfo = userDatasets[0]
        if (req.user.role === 'user' && req.user.id !== String(datasetInfo.userId)) {
            return res.status(400).json({ message: "Invalid Graph!" })
        }
        return res.status(200).json({ diamention: graphInfo.graphConfig.diamentions, type: graphInfo.graphType, title: graphInfo.graphConfig.title, data: datasetInfo.data, datasetId: datasetInfo._id })

    } catch (error) {
        console.log(error)
        if (error.message.includes('Cast to ObjectId failed for value')) return res.status(400).json({ message: "Invalid Graph Id!" })
        return res.status(500).json({ message: error.message });

    }
}

const allGraphs = async (req, res) => {
    try {
        const userDatasets = await dataset.find({}, { _id: 1, userId: 1 })
        const userGraphs = await Graph.find({ datasetId: { $in: userDatasets.map(dataset => dataset._id) } }).select('-__v -updatedAt').sort({ createdAt: -1 })
        //console.log('userGraphs',userGraphs)
        const userData = await user.find({ _id: { $in: userDatasets.map(dataset => dataset.userId)} }, { name: 1, email: 1 })
        const datasetInfo = {}
        userDatasets.forEach(dataset=>{
            datasetInfo[dataset._id] = dataset.userId
        })
        const userInfo = {}
        userData.forEach(user => {
            userInfo[user._id] = { name: user.name, email: user.email }
        })
        const allGraphsData = userGraphs.map(graph=>({id:graph._id, userInfo:userInfo[datasetInfo[graph.datasetId]], ...graph.graphConfig, type:graph.graphType}))
        // console.log(allGraphsData)
        return res.status(200).json(allGraphsData)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });

    }
}

const deleteGraphs = async(req, res)=>{
    try {
        const {selectedRows} = req.body
        // console.log(selectedRows)
        await Graph.deleteMany({_id:{$in: selectedRows}})
        res.status(200).json({message:'Graphs deleted successfully'})        
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: error.message })
    }
}

module.exports = { createGraph, userAllGraphs, graphDetails, allGraphs, deleteGraphs }