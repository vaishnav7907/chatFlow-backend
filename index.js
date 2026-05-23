const express = require("express")
const dotenv= require("dotenv")
const connection =require("./mongodb/config") 
const app = express()
const { Server } = require('socket.io')

const http= require("http")

const server = http.createServer(app)

const router  = require("./router/beatflowRouter")
const setupchat = require("./socket/socketio")


const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})


//ee io argument parameter lek pass cheyyunnu io enna peril 

setupchat(io)


dotenv.config()
connection()

app.use(express.json())
app.use("/ChatFlow",router)
PORT=process.env.PORT
server.listen(PORT,()=>{console.log(`server running on ${PORT}`);
})


