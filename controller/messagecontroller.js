const usermodel = require("../model/authentication");
const messagemodel = require("../model/chatmodel");
const groupmodel = require("../model/groupschema");

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

    await messagemodel.updateMany(
      { senderid: selecteduserid, recieverid: myId },
      { seen: true },
    );

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
    const group = await groupmodel.create({ groupname, members, admin });
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

module.exports = { getallusers, getMessages, creategroup , getallgrps };
