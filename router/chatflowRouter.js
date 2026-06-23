const express = require("express")
const { signup, signIn, dltcontact, searchUser } = require("../controller/authcontroller")
const { getallusers,  getMessages, creategroup, getallgrps, getgroupMsgs, addMembersToGroup, getGroupMembers, dltGroup } = require("../controller/messagecontroller")
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

//create group 
router.post("/creategroup",creategroup)

//get all groups
router.get("/getgroup",getallgrps)

//get group messages
router.get("/getgroupmessages/:groupid",getgroupMsgs)

//post add members in group
router.post("/addMembersToGroup",addMembersToGroup)

//search user
router.get("/searchUser",searchUser)

//get group members
router.get("/getGroupMembers",getGroupMembers)

//delete group
router.delete("/deleteGroup/:groupid",dltGroup)

module.exports=router