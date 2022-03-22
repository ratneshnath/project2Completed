const collegeModel = require("../models/collegeModel");



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const createCollege = async function (req, res){
    try {
        let data = req.body;
        let { name, fullName, logoLink } = data   // Destructuring

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(name)) {
            res.status(400).send({ status: false, msg: "Abb name is required" })
            return
        }
        if (!isValid(fullName)) {
            res.status(400).send({ status: false, msg: "Full name is required" })
            return
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, msg: "LogoLink is required"})
            return
        }
        else {
            let createdCollege = await collegeModel.create(data)
            res.status(201).send({ data: createdCollege })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: error.message});
    }
};





module.exports.createCollege = createCollege;