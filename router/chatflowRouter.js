const express = require("express");
const {
  signup,
  signIn,
  dltcontact,
  searchUser,
  updateprofile,
} = require("../controller/authcontroller");
const {
  getallusers,
  getMessages,
  creategroup,
  getallgrps,
  getgroupMsgs,
  addMembersToGroup,
  getGroupMembers,
  dltGroup,
  getAllChatss,
  createRequest,
  acceptRequest,
  incomingRequest,
  outgoingRequests,
} = require("../controller/messagecontroller");

const settingMidleware = require("../middleware/middleware");
// const { default: upload } = require("../utility/multer");
const {uploadProfileImage,getProfileImage} = require("../controller/profileImgController");
const upload = require("../utility/multer");
const router = express.Router();
//auth routers
router.post("/signup", signup);
router.post("/signin", signIn);

//delete contact

router.delete("/dltcontact/:id", dltcontact);

//get all contacts
router.get("/getallusers", settingMidleware, getallusers);
//send messages
// router.post("/sendmessages/:id",settingMidleware,sendMessages)
//get messages
router.get("/getmessages/:id", settingMidleware, getMessages);

//create group
router.post("/creategroup", creategroup);

//get all groups
router.get("/getgroup",settingMidleware, getallgrps);

//get group messages
router.get("/getgroupmessages/:groupid", getgroupMsgs);

//post add members in group
router.post("/addMembersToGroup", addMembersToGroup);

//search user
router.get("/searchUser", searchUser);

//get group members
router.get("/getGroupMembers", getGroupMembers);

//delete group
router.delete("/deleteGroup/:groupid", dltGroup);

//get both personal and group allchats

router.get("/getallchats", settingMidleware, getAllChatss);


// upload profile image to cloudinary

router.put("/uploadprofileimage",  settingMidleware,upload.single("image"),uploadProfileImage)

//get profile img
router.get("/getProfileImg",settingMidleware,getProfileImage)


//update profile

router.patch("/updateProfile/:id",settingMidleware,updateprofile)



//request

// request create
router.post("/createRequest",settingMidleware,createRequest)

//accept request
router.patch("/acceptRequest/:requestid",settingMidleware,acceptRequest)

//incoming request

router.get("/incomingRequest",settingMidleware,incomingRequest)

//outgoing request
router.get("/outgoingRequest",settingMidleware,outgoingRequests)



module.exports = router;
