const mongoose = require("mongoose");

const groupchatSchema = mongoose.Schema({
  groupid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groupmodel",
  },
  senderid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authentication_Model",
  },
  text:{type:String}
},
  { timestamps: true });



  const groupchatModel= mongoose.model("groupchat",groupchatSchema)
  module.exports=groupchatModel