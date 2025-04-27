const Graphs = require("../model/graphs")
const Users = require("../model/user")
const Datasets = require("../model/dataset")

const adminDashboard = async(req, res)=>{
    try{

        
        const typesOfGraphs = ['Bar', 'Line', 'Pie', 'Scatter']
        const today = new Date()
        const currentMonthStartDate = new Date(new Date().setDate(1))
        const lastSixMonthStartDate = new Date(new Date().setMonth(today.getMonth()-6,1))
        const totalUsers = await Users.countDocuments()
        const totalGraphs = await Graphs.countDocuments()
        const totalDatasets = await Datasets.countDocuments()
        const currentMonthGraphs = await Graphs.countDocuments({createdAt:{$lte:today, $gte:currentMonthStartDate}})
        const usersInLastSixMonths = await Users.find({createdAt:{$lte:today, $gte:lastSixMonthStartDate}},{createdAt:1})
        const graphsInLastSixMonths = await Graphs.find({createdAt:{$lte:today, $gte:lastSixMonthStartDate}},{createdAt:1, graphType:1})
        const allGraphs = await Graphs.find({},{graphType:1})
        const allGraphsData = {}
        typesOfGraphs.forEach(type => {
            allGraphsData[type]=allGraphs.filter(graph=>graph.graphType === type.toLowerCase()).length
        });

        //const top3GraphCreater = await Graphs.aggregate([{group:{"id":'$_id', "count":{$sum:1}}},{$sort : {"count" : -1}}, {$limit : 3}])

        
        //console.log('all', top3GraphCreater)
        const top3GraphCreater = await Graphs.aggregate([
            {
              $lookup: {
                from: 'datasets',
                localField: 'datasetId',
                foreignField: '_id',
                as: 'dataset'
              }
            },
            { $unwind: '$dataset' },
          
            {
              $lookup: {
                from: 'users',
                localField: 'dataset.userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
          
            {
              $group: {
                _id: '$user._id',
                name: { $first: '$user.name' },
                email: { $first: '$user.email' },
                graphCount: { $sum: 1 }
              }
            },
            { $sort: { graphCount: -1, } },
            { $limit: 3 }
          ]);

          const recentCreations = await Graphs.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
          
            {
              $lookup: {
                from: 'datasets',
                localField: 'datasetId',
                foreignField: '_id',
                as: 'dataset'
              }
            },
            { $unwind: '$dataset' },

            {
              $lookup: {
                from: 'users',
                localField: 'dataset.userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            {
              $project: {
                _id: 0,
                graphTitle: '$graphConfig.title',
                graphType: 1,
                creatorName: '$user.name'
              }
            }
          ]);
        const monthlyUsers = {}
        const monthlyGraphs = {}
        const monthlyGraphsByTypes = {}
        
        for (let i = 0; i < 6; i++) {
            const firstDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
            //console.log(firstDate, lastDay)
            const monthGraphsData = graphsInLastSixMonths.filter(date=>date.createdAt>=firstDate&&date.createdAt<=lastDay)
            monthlyUsers[firstDate.toLocaleDateString(undefined, {month: "long"})] = usersInLastSixMonths.filter(date=>date.createdAt>=firstDate&&date.createdAt<=lastDay).length
            monthlyGraphs[firstDate.toLocaleDateString(undefined, {month: "long"})] = monthGraphsData.length
            //monthlyGraphsByTypes[firstDate.toLocaleDateString(undefined, {month: "long"})] = 
            // graphsInLastSixMonths.filter(date=>date.createdAt>=firstDate&&date.createdAt<=lastDay)
            const graphType = {}
            typesOfGraphs.forEach(type => {
                graphType[type]=monthGraphsData.filter(graph=>graph.graphType === type.toLowerCase()).length
            });
            monthlyGraphsByTypes[firstDate.toLocaleDateString(undefined, {month: "long"})] =  graphType

          }

        //console.log(monthlyUsers,monthlyGraphs,monthlyGraphsByTypes)
        res.status(200).json({header:{totalUsers,totalGraphs,totalDatasets, currentMonthGraphs}, activity:{monthlyUsers, monthlyGraphs}, distribution:allGraphsData, topCreators:top3GraphCreater, recentCreations, monthlyGraphsByTypes})
    }
    catch(error){
        console.log(error)

    }
    

}

module.exports = {adminDashboard}