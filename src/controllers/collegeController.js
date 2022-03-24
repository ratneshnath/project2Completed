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
            res.status(400).send({ status: false, msg: "Abbreviation name is required" })
            return
        }
        let isNameAlreadyUsed = await collegeModel.findOne({ name })
        if (isNameAlreadyUsed) {
           return res.status(400).send({ status: false, msg: "This name has already used" })
        }
        // let nameRules = /^[a-z]*$/;
        // if (nameRules.test(name) == false){
        //    return res.status(400).send({ status: false, msg: "Name should not have anything except letters"})
        // }


        if (!isValid(fullName)) {
            res.status(400).send({ status: false, msg: "Full name is required" })
            return
        }
        // let fullNameRules = /^[a-z]*$/;
        // if (fullNameRules.test(fullName) == false){
        //     res.status(400).send({ status: false, msg: "fullName should not have anything except letters"})
        // }
        

        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, msg: "LogoLink is required"})
            return
        }
        else {
            let createdCollege = await collegeModel.create(data)
           return res.status(201).send({ data: createdCollege })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: error.message});
    }
};





module.exports.createCollege = createCollege;