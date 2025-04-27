const { GoogleGenerativeAI } = require("@google/generative-ai");
const dataset = require('../model/dataset');

const analyzeDataset = async (req, res) => {
    try {
        const id = req.params.id
        // const gemini = new Gemini(process.env.GEMINI_API_KEY);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const datasetData = await dataset.findById(id, { data: 1 })
        if (!datasetData?.data) return res.status(400).json({ message: "Dataset doesn't exists!" })

        const prompt = `generate  Data Analysis & Insights shortly on this json data ${datasetData?.data} also Format the response using Markdown with #### for primary highlights (similar to <h5>) and #### for secondary points (similar to <h6>). Apply this to titles, key insights, and list items, keeping regular content as plain text.`
        //console.log(prompt)
        const result = await model.generateContent([prompt]);
        return res.status(200).json(result.response.text())
//console.log();


        // const execute = async(msg)=>{
        //     console.log(await gemini.ask(msg));
        // }
        // execute(msg)

    } catch (error) {
        return res.status(500).json({message:error.message});

    }

}

module.exports = { analyzeDataset }