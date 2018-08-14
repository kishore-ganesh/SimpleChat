const models = require("./models.js");
const controller = require("./controller.js");

var io;

function initializeSocket(server) {
  io = require("socket.io")(server);
}

function startListening() {
  io.on("connection", socket => {
    //console.log(socket);
    onSocketConnection(socket);
  });
}

function onSocketConnection(socket) {
  {
    //var username;
    var selectedUser;
    var userdb;
    console.log("onSocketConnection");
    //console.log(user6s);

    io.emit("updatelist");

    console.log("initializing");
    socket.on("handshake", data => {
      console.log("handshake");
      username = data.username;
      socket.join(username);
      controller.addToUserList(username);
      userdb = models.defineModel(username);
      userdb.sync();
      io.emit("updatelist");
    });

    ///  console.log(users);
    // console.log(users);
    //console.log(username.toString());

    // io.to(username).emit({
    //     items:[{from:"server", to: "client", messages: "initialized"}]
    // })

    socket.on("userSelected", data => {
      console.log("emitting");
      selectedUser = data.selectedUser;
      controller.returnMessages(selectedUser, username).then(messages => {
        io.to(username).emit("message", { items: messages });
      });
    });

    socket.on("send", data => {
      console.log("sending");
      //  to=data.to;

      sendMessage(username, selectedUser, data.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnecting from room");
      //socket.leave(username);
      //  console.log(users[username]);

      controller.deleteFromUserList(username);
      io.emit("updatelist");
    });
  }
}

function sendMessage(from, to, message) {
  //console.log(usersockets);
  messageobj = {
    items: [
      {
        from: from,
        to: to,
        messages: message
      }
    ]
  };

  //    console.log(users.length);
  //console.log(from+" "+to);
  io.to(from).emit("message", messageobj);
  io.to(to).emit("message", messageobj);

  fromdb = models.defineModel(from);
  todb = models.defineModel(to);

  //    controller.updateDB(messagesdb, from, to, message);
  controller.updateDB(fromdb, from, to, message);
  controller.updateDB(todb, from, to, message);
}
module.exports = { initializeSocket, startListening };
