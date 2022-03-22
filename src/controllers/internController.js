const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;




const createIntern = async function (req, res) {
    try {
      const data = req.body

      
      if (!data.name) {
        return res.status(400).send({ status: false, msg: "error, please provide valid name" })
      }
      if (!data.email) {
        return res.status(400).send({ status: false, msg: "error, please provide valid email" })
      }
      if (!data.mobile) {
        return res.status(400).send({ status: false, msg: "error, please provide valid mobile" })
      }
      if (!data.collegeId) {
        return res.status(400).send({ status: false, msg: "error, please provide valid collegeId" })
      }
      
      
      
        const internName = await internModel.create(data)
      return res.status(201).send({ status: true, msg: internName })
  
    }
    catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
  }

  const getCollegeDetails = async function (req, res) {
    try {
            let college_name = req.query.collegeName
            let data = await collegeModel.findOne({ name: college_name })
            const College_id = data._id
            if (!data) {
               return res.status(403).send({ status: false, message: "The value is Invalid" });
            }
            let internDetails = await internModel.find({ collegeId: College_id, isDeleted: false })
           res.status(200).send({ data: data, Interns: internDetails })
        } catch (err) {
        console.log(err)
        res.status(500).send({status: false, message: err.message })
    }
}

// const getCollegeDetails = async function (req, res) {

//     try {
//         let input = req.query.name
//         if (!input)
//             return res.status(400).send({ status: false, msg: "Please Send Some Filters" })
        
//         let collegeDetails = await collegeModel.findOne({name:input});
//         if (!collegeDetails) {
//             return res.status(404).send({ status: false, msg: "No such college exists" });
//         }
//         else {
//             let clog = req.body.collegeId
//             if (Object.entries(clog).length === 0) {
//                  res.status(400).send({ status: false, msg: "Kindly pass some data " })
//             }

//             let internsList = await internModel.findOne({collegeId:clog});
//             res.status(200).send({ status: true, msg: internsList });
//         }

//     }
//     catch (err) {
//         console.log("this is the error:", err.message)
//         res.status(500).send({ status: false, msg: err.message })
//     }
// };

module.exports.createIntern = createIntern;
module.exports.getCollegeDetails = getCollegeDetails;