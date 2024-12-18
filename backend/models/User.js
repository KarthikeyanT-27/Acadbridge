const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,  required: true }, // 'student' or 'staff'
    name:{type:String,required:true},
    department: { type: String },
    registernumber:{type:String },
    dob:{type:String,require:true},
    college:{type:String, require:true},
    batch:{type:String,require:true },
    domain:{type:String,require:true},
    imageUrl:{type:String}
});

const User = mongoose.model("User", userSchema);

module.exports=User;