const monngoose = require("mongoose")


const connection= async()=>{
     
try {
    const connect =  await monngoose.connect(process.env.MONGDB_URI)
    console.log("successfully connected to mongodb");
    
} catch (error) {
    console.log("error in connection with mongodb",error);
    process.exit()
    
}

}


module.exports=connection