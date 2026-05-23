const express = require("express")
const { signup, signIn } = require("../controller/authcontroller")

const router = express.Router()

router.post("/signup",signup)
router.post("/signin", signIn)

module.exports=router