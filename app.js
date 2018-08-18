const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const models = require("./models.js");
const controller = require("./controller.js");
const sockets = require("./sockets.js");
const session = require("express-session");
const auth = require("./auth.js");
const routes=require('./router.js');

sockets.initializeSocket(server);
sockets.startListening();

app.use(session({ secret: "cat", resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth.passport.initialize());
app.use(auth.passport.session());


models.usermodel.sync().then(() => {
  app.use('/', routes)
  app.use(express.static("public_static"));
});


server.listen(80);
