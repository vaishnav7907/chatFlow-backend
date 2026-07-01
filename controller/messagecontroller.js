const usermodel = require("../model/authentication");
const messagemodel = require("../model/chatmodel");
const groupmodel = require("../model/groupschema");
const groupChatModel = require("../model/groupChatSchema");

const getallusers = async (req, res) => {
  try {
    console.log("req user:", req.user);
    console.log("REQ USER ID:", req.user?.id);
    const loggedInUserid = req.user.id;
    const filteruser = await usermodel
      .find({ _id: { $ne: loggedInUserid } })
      .select("-Password");

    res.status(200).json(filteruser);
  } catch (error) {
    console.log("error in getallusers", error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: selecteduserid } = req.params;
    const myId = req.user.id;
    const messages = await messagemodel.find({
      $or: [
        { senderid: myId, recieverid: selecteduserid },
        { senderid: selecteduserid, recieverid: myId },
      ],
    });

    // await messagemodel.updateMany(
    //   { senderid: selecteduserid, recieverid: myId },
    //   { seen: true },
    // );

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getmessage", error);

    res.status(500).json({ error: "internal server error" });
  }
};

// const sendMessages = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const  recieverid  = req.params.id
//     const senderid = req.user.id;
//     console.log("senderid:", senderid);

//     const newMessages = await messagemodel.create({
//       senderid,
//       recieverid,
//       text,
//       image,
//     });

//     await newMessages.save();
//     res.status(201).json(newMessages);
//   } catch (error) {
//     console.log(" error in send message :", error);
//     res.status(500).json({ error: "iinternal server error" });
//   }
// };

// create group
const creategroup = async (req, res) => {
  try {
    const { groupname, members, admin } = req.body;
    const group = await groupmodel.create({
      groupname,
      members: [...members, admin],
      admin,
    });
    res.status(201).json(group);
  } catch (error) {
    console.log("creating group error", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getallgrps = async (req, res) => {
  try {
    const getgrp = await groupmodel.find();
    res.status(200).json(getgrp);
  } catch (error) {
    console.log("error in get all groups:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getgroupMsgs = async (req, res) => {
  try {
    const { groupid } = req.params;
    const grpchat = await groupChatModel
      .find({ groupid: groupid })
      .populate("senderid", "Username")
      .sort({ createdAt: 1 });
    res.status(200).json(grpchat);
  } catch (error) {
    console.log(" error in grp message", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// add members to group

const addMembersToGroup = async (req, res) => {
  try {
    const { groupid, userid } = req.body;
    const groupexist = await groupmodel.findById(groupid);

    if (!groupexist) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (groupexist.members.includes(userid)) {
      return res.status(400).json({ message: "Already in group" });
    }

    groupexist.members.push(userid);
    await groupexist.save();
    res.status(200).json(groupexist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupMembers = async (req, res) => {
  const { groupname } = req.query;
  // const {admin}=red.body
  try {
    // if(!admin){
    //   return res.json(" admin doesn't exist ")
    // }
    const groupexist = await groupmodel
      .findOne({ groupname })
      .populate("members", "Username _id");
    if (!groupexist) {
      return res.json({ message: "group doesn't exist" });
    }

    console.log("group members", groupexist.members);

    res.status(200).json({
      members: groupexist.members,
    });
  } catch (error) {
    console.log("error in get all members of a group", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const dltGroup = async (req, res) => {
  const { groupid } = req.params;

  try {
    // if (!groupid) {
    //   return
    // }
    const groupremove = await groupmodel.findByIdAndDelete(groupid);
    if (!groupremove) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "group deleted" });
  } catch (error) {
    console.log("error in deletion of group", error);
  }
};



// get all chats 
const getAllChatss=async(req,res)=>{
try {
  
} catch (error) {
  
}
}

module.exports = {
  getallusers,
  getMessages,
  creategroup,
  getallgrps,
  getgroupMsgs,
  addMembersToGroup,
  getGroupMembers,
  dltGroup,
};
