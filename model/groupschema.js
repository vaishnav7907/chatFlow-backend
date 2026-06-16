const mongoose= require("mongoose")

const group= new mongoose.Schema({
    groupname:{type:String,required:true},
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"authentication_Model"
    }],
    admin:{type:mongoose.Schema.Types.ObjectId,
        ref:"authentication_Model"
    }
},{
    timestamps:"true"
})



const groupmodel=mongoose.model("groupmodel",group)
module.exports=groupmodel