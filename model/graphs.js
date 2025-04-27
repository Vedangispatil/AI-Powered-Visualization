const mongoose = require("mongoose");

const GraphSchema = new mongoose.Schema({
    datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
    graphType: { type: String, enum: ['bar', 'line', 'pie', 'scatter'], required: true },
    graphConfig: {
        title: { type: String, required: true },
        diamentions: { type: String, enum: ['2d', '3d'], required: true },
    },
    graphPreview: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Graph', GraphSchema)