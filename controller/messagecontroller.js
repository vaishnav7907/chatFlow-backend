const usermodel = require("../model/authentication");
const messagemodel = require("../model/chatmodel");
const groupmodel = require("../model/groupschema");
const groupChatModel = require("../model/groupChatSchema");
const chatrequestModel = require("../model/chatRequest");
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
    const myId = req.user.id;
    const getgrp = await groupmodel.find({ members: myId });
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
const getAllChatss = async (req, res) => {
  try {
    const myId = req.user.id;

    //get allpersonal messages

    const personalMessages = await messagemodel
      .find({
        $or: [{ senderid: myId }, { recieverid: myId }],
      })
      .populate("senderid", "Username ProfileImage")
      .populate("recieverid", "Username ProfileImage")
      .sort({ createdAt: -1 }); //newest first

    //object to store one chat per user

    const personalchat = {};

    for (const msg of personalMessages) {
      //find other persons details
      const otherUsers =
        String(msg.senderid._id) === String(myId)
          ? msg.recieverid
          : msg.senderid;

      //skip myid
      if (String(otherUsers._id) === String(myId)) continue;

      // if this usser already added skip it
      if (personalchat[otherUsers._id]) continue;

      //store only latest message

      personalchat[otherUsers._id] = {
        _id: otherUsers._id,
        Username: otherUsers.Username,
        ProfileImage: otherUsers.ProfileImage,
        lastMessage: msg.text,
        createdAt: msg.createdAt,
      };
    }

    //get all groupchat
    const myGroups = await groupmodel.find({ members: myId });
    const groupChats = {};

    for (const group of myGroups) {
      const lastMsg = await groupChatModel
        .findOne({ groupid: group._id })
        .sort({ createdAt: -1 });
      if (!lastMsg) continue;

      groupChats[group._id] = {
        _id: group._id,
        groupname: group.groupname,
        lastMessage: lastMsg.text,
        createdAt: lastMsg.createdAt,
      };
    }

    //merge personal and group chats

    const mergeAllChats = [
      ...Object.values(personalchat),
      ...Object.values(groupChats),
    ];

    //latest chat first
    mergeAllChats.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(mergeAllChats);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const searchContacts = async (req, res) => {
  try {
    const { search } = req.query;
    const allContacts = await usermodel.find({
      _id: { $ne: req.user.id },   // $ne it means not equal to.  req.user.id or me. so here find all ids not equal to req.user.id  . so when we search with username our username will remain exclude 
      Username: { $regex: search || "", $options: "i" },  //$regex used for search. $options: when we search a name with capital letter M that time only get result how much username have with capiatl letter M. so for  overcome that issue  we used $options. here when we search a username using with any small or capital letter , gets all posible results 
    });


    res.status(200).json(allContacts)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// send request and accept request

const createRequest = async (req, res) => {
  try {
    const sender = req.user.id;
    const { reciever } = req.body;

    // cant send request a sender to sender
    if (sender === reciever) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }

    // checking request already exist

    const requestExist = await chatrequestModel.findOne({
      $or: [
        { sender, reciever },
        {
          sender: reciever,
          reciever: sender,
        },
      ],
    });

    if (requestExist) {
      if (requestExist.status === "pending") {
        return res.status(400).json({
          message: "Chat request already exists",
        });
      }

      if (requestExist.status === "accepted") {
        return res.status(400).json({
          message: "You are already connected",
        });
      }

      if (requestExist.status === "rejected") {
        requestExist.sender = sender;
        requestExist.reciever = reciever;
        requestExist.status = "pending";

        await requestExist.save();

        return res.status(200).json({
          message: "Request sent again",
          data: requestExist,
        });
      }
    }

    const request = await chatrequestModel.create({
      sender,
      reciever,
    });

    return res.status(201).json({
      message: "Request sent successfully",
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { requestid } = req.params;
    const myId = req.user.id;

    // find request

    const findRequest = await chatrequestModel.findById(requestid);

    if (!findRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    //only reciever can accept

    if (String(findRequest.reciever) !== String(myId)) {
      return res.status(403).json({
        message: "You are not allowed to accept this request",
      });
    }

    // already accepted

    if (findRequest.status === "accepted") {
      return res.status(400).json({
        message: "Request already accepted",
      });
    }

    findRequest.status = "accepted";
    await findRequest.save();
    res.status(200).json({
      message: "Request accepted",
      findRequest,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const incomingRequest = async (req, res) => {
  try {
    const requests = await chatrequestModel
      .find({ reciever: req.user.id, status: "pending" })
      .populate("sender", "Username ProfileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.log("incoming request error", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const outgoingRequests = async (req, res) => {
  try {
    const request = await chatrequestModel
      .find({ sender: req.user.id, status: "pending" })
      .populate("reciever", "Username ProfileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(request);
  } catch (error) {
    console.log("incoming request error", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { requestid } = req.params;

    const findrequest = await chatrequestModel.findOne({
      _id: requestid,
      reciever: req.user.id,
      status: { $in: ["pending", "accepted"] },
    });

    if (!findrequest) {
      return res.status(400).json({ message: "request not found" });
    }

    findrequest.status = "rejected";
    await findrequest.save();

    res
      .status(200)
      .json({ message: "request rejected successfully ", data: findrequest });
  } catch (error) {
    console.log(" error in reject request", error);
    res.status(500).json({ message: error.message });
  }
};

const deletemsgConnection = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userid } = req.params;

    const findConnection = await chatrequestModel.findOneAndDelete({
      $or: [
        { sender: myId, reciever: userid, status: "accepted" },
        { sender: userid, reciever: myId, status: "accepted" },
      ],
    });

    if (!findConnection) {
      return res.status(404).json({
        message: "Connection not found",
      });
    }

    res.status(200).json({
      message: "Connection deleted successfully",
    });
  } catch (error) {
    console.log("user msg connection error", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
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
  rejectRequest,
  deletemsgConnection,
  searchContacts
};
