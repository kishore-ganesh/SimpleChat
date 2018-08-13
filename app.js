const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const models = require("./models.js");
const controller = require("./controller.js");
const sockets = require("./sockets.js");
const session = require("express-session");
const auth = require("./auth.js");

sockets.initializeSocket(server);
sockets.startListening();
users = [];


app.use(session({ secret: "cat", resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.post("/users", (req, res) => {
  userlist = getUserList();
  // console.log(userlist);
  res.send(JSON.stringify(userlist));
});

models.usermodel.sync().then(() => {
  app.get("/", (req, res) => {
    if (req.user) {
        

     res.sendFile(__dirname + "/public_static/index.html");
    } else {
        res.redirect('/login');
    }
  });

  app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public_static/login.html");
  });

  app.post(
    "/login",
    auth.passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: false
    })
  );

  app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/public_static/register.html");
  });

  app.post("/register", (req, res) => {
    // implement hashing

    username = req.body.username;
    password = req.body.password;
    console.log(username);
    controller.createUser(username, password);
    res.redirect("/login"); // implement auto log in
  });

  app.use(express.static("public_static"));
});

function getUserList() {
  // console.log(users.length);
  return users;
  //make this more efficient
}

server.listen(4000);
