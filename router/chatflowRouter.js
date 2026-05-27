const express = require("express")
const { signup, signIn } = require("../controller/authcontroller")
const { getallusers } = require("../controller/messagecontroller")
const settingMidleware = require("../middleware/middleware")

const router = express.Router()
//auth routers
router.post("/signup" ,signup)
router.post("/signin", signIn)


//get all contacts
router.get("/getallusers",settingMidleware,getallusers)


module.exports=router