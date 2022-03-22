const mongoose = require("mongoose");



const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "name in abb is required",
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: "Full name of college is required",
        trim: true
    },
    logoLink: {
        type: String,
        required: "Link is required"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });



module.exports = mongoose.model("College", collegeSchema);