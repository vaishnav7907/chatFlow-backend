const express = require("express")
const dotenv= require("dotenv")

const connection =require("./mongodb/config") 
dotenv.config()
const app = express()
const { Server } = require('socket.io')
const cors = require("cors");
const http= require("http")

const server = http.createServer(app)

const router  = require("./router/chatflowRouter")
const setupchat = require("./socket/socketio")

app.use(
  cors({
    origin: "http://localhost:5173",
    
  })
);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})


//ee io argument parameter lek pass cheyyunnu io enna peril 

setupchat(io)



connection()

app.use(express.json())
app.use("/ChatFlow",router)
PORT=process.env.PORT
server.listen(PORT,()=>{console.log(`server running on ${PORT}`);
})


