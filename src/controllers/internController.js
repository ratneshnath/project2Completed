const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;




const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)  // for validating objectId
}

const createIntern = async function (req, res) {
    try {
        let data = req.body;
        let { name, email, mobile, collegeName, collegeId } = data  // Destructuring

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(name)) {
            res.status(400).send({ status: false, msg: "Abb name is required" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is required" })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email should be valid email address" })
            return
        }
        let isEmailAlreadyUsed = await internModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, msg: "Email address already used" })
        }
        if (!isValid(mobile)) {
            res.status(400).send({ status: false, msg: "Mobile must be present" })
        }
        if (!(/^\d{10}$/.test(mobile))) {
            res.status(400).send({ status: false, msg: "Mobile number should be of 10 digits" })
        }
        let isMobileAlreadyUsed = await internModel.findOne({ mobile })
        if (isMobileAlreadyUsed) {
            res.status(400).send({ status: false, msg: "Mobile Number already used" })
        }
        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, msg: "Full name of college is required" })
            return
        }
        if (!isValid(collegeId)){
            res.status(400).send({ status: false, msg: "CollegeId is required"})
            return
        }
        if (!isValidObjectId(collegeId)){
            res.status(400).send({ status: false, msg: "This is not a valid collegeId"})
            return
        }

        const college = await collegeModel.find({ fullName: collegeName })
        if (!isValid(college)) {
            res.status(404).send({ status: false, msg: "College not found" })
            return
        }
        data.collegeId = college[0]._id
        delete data["collegeName"]

        const createdIntern = await internModel.create(data)
            res.status(201).send({ data: createdIntern })
            return

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
};


const collegeDetails = async function (req, res){
    try {
         let collegeName = req.query.collegeName

         if (!isValid(collegeName)) {
            res.status(400).send({ status: false, msg: "Not able to found college" })
            return
        }
        let collegeData = await collegeModel.findOne({ name: collegeName })
        if (!isValid(collegeData)){
            res.status(404).send({ status: false, msg: "Not able to found collegeData" })
            return
        } else{
            let internDetail = {
                name: collegeData.name,
                fullName: collegeData.fullName,
                logoLink: collegeData.logoLink,
                interests: []
            }
            let collegeId = collegeData._id
            let appliedIntern = await internModel.find({ collegeId: collegeId }).select({ name: 1, email: 1, mobile: 1, collegeId: 1})
            internDetail.interests = appliedIntern
            res.status(200).send({ status: true, data: internDetail })
        }
           

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message});
    }
};

module.exports.createIntern = createIntern;
module.exports.collegeDetails = collegeDetails;