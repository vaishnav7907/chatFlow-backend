//io parameter
//this is broadcast messaging
// const setupchat = (io) => {
//   io.on("connection", (socket) => {
//     //send message

//     console.log(`new user connected socket id : ${socket.id}`);
//     socket.on("sendmessage", (data) => {
//       console.log(`message from ${data.username}:${data.message}`);

//       io.emit("recievemessage", {
//         type: "normal",
//         from: data.username,
//         message: data.message,
//         time: new Date().toLocaleTimeString(),
//       });
//     });

//     // replay message

//     socket.on("replymessage", (data) => {
//       console.log(`${data.username} replied to ${data.replyTo.username}`);

//       //send reply messages to all users
//       io.emit("recievereplymessage", {
//         type: "reply",
//         from: data.username,
//         message: data.message,

//         replyTo: {
//           username: data.replyTo.username,
//           message: data.replyTo.message,
//         },
//         time: new Date().toLocaleTimeString(),
//       });
//     });
//   });
// };

// personal message

const msgmodel = require("../model/chatmodel");
const groupmodel = require("../model/groupschema");
const groupchatmodel = require("../model/groupChatSchema");
const onlineusers = new Map();
const setupchat = (io) => {
  io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.on("join", (userId) => {
      onlineusers.set(userId, socket.id);

      console.log("online users", [...onlineusers.entries()]);
    });

    socket.on("sendmessage", async (data) => {
      const { senderid, recieverid, text } = data;

      if (!recieverid || !text?.trim()) return;

      try {
        const savemessage = await msgmodel.create({
          senderid,
          recieverid,
          text,
        });

        // send to sender
        socket.emit("recievemessage", savemessage);

        //send to reciever

        const recieverSocketId = onlineusers.get(recieverid);

        if (recieverSocketId) {
          io.to(recieverSocketId).emit("recievemessage", savemessage);
        }
      } catch (error) {
        console.log("send message error", error);
        socket.emit("messageError", {
          message: "failed to send message. please try again",
        });
      }
    });

    //group chat ..................

    socket.on("joingroup", (groupid) => {
      socket.join(groupid);
      console.log(`Socket ${socket.id} joined group ${groupid}`);
    });

    socket.on("sendGroupMsg", async (sendData) => {
      const { groupid, senderid, text } = sendData;

      if (!groupid || !senderid|| !text?.trim()) return;

      try {
        const groupMember = await groupmodel.findOne({
          _id: groupid,
          members: senderid,
        });
        if (!groupMember) {
          return socket.emit("messageerror", {
            message: "You are not a member of this group",
          });
        }
        //save message
        const groupmessage = await groupchatmodel.create({
          groupid,
          senderid,
          text,
        });

        //populate sender
        const populatemsg = await groupchatmodel
          .findById(groupmessage._id)
          .populate("senderid", "Username");

        //send to all group members 
        io.to(groupid).emit("recieveGroupMsg", populatemsg);
      } catch (error) {
        console.log("group message error:", error);
        socket.emit("messageError", {
          message: "Failed to send group message",
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineusers.entries()) {
        if (socketId === socket.id) {
          onlineusers.delete(userId);
          break;
        }
      }

      console.log("Disconnected:", socket.id);
      console.log("online users", [...onlineusers.entries()]);
    });
  });
};

module.exports = setupchat;
