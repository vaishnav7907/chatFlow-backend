const mongoose = require("mongoose")

const chatschema = new mongoose.Schema({

// roomid:{type:String , required:true, unique:true},
senderid:{type:mongoose.Schema.ObjectId,ref:"authentication_Model",required:true},
recieverid:{type:mongoose.Schema.ObjectId,ref:"authentication_Model",required:true},
text:{type:String},
image:{type:String}


},
{timestamps:true})

const messagemodel =  mongoose.model("messageModel",chatschema)
module.exports=messagemodel