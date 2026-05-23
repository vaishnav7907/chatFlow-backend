const mongoose = require("mongoose")

const chatschema = new mongoose.Schema({

senderid:{type:mongoose.Schema.ObjectId,ref:"authentication_Model",required:true},
recieverid:{type:mongoose.Schema.ObjectId,ref:"authentication_Model",required:true},
text:{type:String},
image:{type:String}


},
{timeseries:true})

const messagemodel =  mongoose.model("messageModel",chatschema)
module.exports=messagemodel