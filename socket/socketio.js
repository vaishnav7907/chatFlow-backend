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
const onlineusers = new Map();

const setupchat = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("join_room", (userId) => {
      socket.join(userId);

      socket.userId = userId;
      onlineusers.set(userId, socket.id);
      console.log(`${userId} is joined`);
      console.log("online users:", onlineusers);
    });

    
    socket.on("send_message", (data) => {
      console.log("this is send message", data);
      io.to(data.receiverid).emit("recieve_message", {
        senderid: socket.userId,
        text: data.text,
      });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineusers.delete(socket.userId);
      }

      console.log("user disconnected", socket.id);
      console.log("online users", onlineusers);
    });
  });
};

module.exports = setupchat;
