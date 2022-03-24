const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)  // for validating objectId
}






const createIntern = async function (req, res) {
    try {
      const data = req.body
      let { name, email, mobile, collegeId } = data  // Destructuring

      
      if (!name) {
        return res.status(400).send({ status: false, msg: "error, please provide student name" })
      }
      if (!email) {
        return res.status(400).send({ status: false, msg: "error, please provide valid email" })
      }
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        res.status(400).send({ status: false, msg: "email should be valid email address" })
        return 
    }
    let isEmailAlreadyUsed = await internModel.findOne({email})
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, msg: "Email address is already used"})
          return
        }

      if (!mobile) {
        return res.status(400).send({ status: false, msg: "error, please provide valid mobile number" })
      }
      if (!(/^\d{10}$/.test(mobile))) {
       return res.status(400).send({ status: false, msg: "Mobile number should be of 10 digits" })
    }
    let isMobileAlreadyUsed = await internModel.findOne({ mobile })
    if (isMobileAlreadyUsed) {
       return res.status(400).send({ status: false, msg: "Mobile Number already used" })
    }

      if (!collegeId) {
        return res.status(400).send({ status: false, msg: "error, please provide valid collegeId" })
      }
      if (!isValidObjectId(collegeId)){
        res.status(400).send({ status: false, msg: "This is not a valid collegeId"})
        return
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
            if(!college_name){
              return res.status(400).send({status: false, msg: "College Name is required in query param"})
            }

            let data = await collegeModel.findOne({ name: college_name })
            
           // const College_id = data._id
            if (!data) {
               return res.status(400).send({ status: false, message: "The value is Invalid" });
            }
            const college_id = data._id

            let internDetails = await internModel.find({ collegeId: college_id, isDeleted: false })
          
          return res.status(200).send({ data: data, Interns: internDetails })
          
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