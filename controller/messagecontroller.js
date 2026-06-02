const usermodel = require("../model/authentication");
const messagemodel = require("../model/chatmodel");
const getallusers = async (req, res) => {
  try {
    const loggedInUserid = req.user._id;
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
    const { id: userChatId } = req.params;
    const myId = req.user.id;
    const messages = await messagemodel
      .find({
        $or: [
          { senderid: myId, recieverid: userChatId },
          { senderid: userChatId, recieverid: myId },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getmessage", error);

    res.status(500).json({ error: "internal server error" });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverid } = req.params;
    const senderid = req.user.id;
    console.log("senderid:", senderid);

    const newMessages = new messagemodel({
      senderid,
      recieverid,
      text,
      image,
    });

    await newMessages.save();
    res.status(201).json(newMessages);
  } catch (error) {
    console.log(" error in send message :", error);
    res.status(500).json({ error: "iinternal server error" });
  }
};

module.exports = { getallusers, getMessages, sendMessages };
