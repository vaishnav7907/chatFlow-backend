const mongoose = require("mongoose")

const userschema= new mongoose.Schema({
Email:{type:String,required:true,unique:true},
Username:{type:String,required:true},
Password:{type:String, required:true}
},
{
    timestamps:true
})


const usermodel = mongoose.model("authentication_Model",userschema)
module.exports=usermodel