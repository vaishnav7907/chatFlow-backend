const express = require("express")
const { signup, signIn } = require("../controller/authcontroller")
const { getallusers, sendMessages, getMessages } = require("../controller/messagecontroller")
const settingMidleware = require("../middleware/middleware")

const router = express.Router()
//auth routers
router.post("/signup" ,signup)
router.post("/signin", signIn)


//get all contacts
router.get("/getallusers",settingMidleware,getallusers)
//send messages
router.post("/sendmessages/:id",settingMidleware,sendMessages)
//get messages
router.get("/getmessages/:id",settingMidleware,getMessages)


module.exports=router