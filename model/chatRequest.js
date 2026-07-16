const mongoose = require("mongoose");

const chatrequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authentication_Model",
    required: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authentication_Model",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
},{timestamps:true});

chatrequestSchema.index({sender:1,reciever:1},
    {unique:true}
)

const chatrequestModel=mongoose.model("chatRequest",chatrequestSchema)
module.exports=chatrequestModel
