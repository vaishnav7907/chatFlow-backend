const express = require("express")
const { signup, signIn, dltcontact } = require("../controller/authcontroller")
const { getallusers,  getMessages } = require("../controller/messagecontroller")
const settingMidleware = require("../middleware/middleware")

const router = express.Router()
//auth routers
router.post("/signup" ,signup)
router.post("/signin", signIn)

//delete contact

router.delete("/dltcontact/:id",dltcontact)

//get all contacts
router.get("/getallusers",settingMidleware,getallusers)
//send messages
// router.post("/sendmessages/:id",settingMidleware,sendMessages)
//get messages
router.get("/getmessages/:id",settingMidleware,getMessages)


module.exports=router