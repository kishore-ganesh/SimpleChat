const express = require("express");
const auth = require("./auth.js");
const router = express.Router();
const controller=require('./controller.js')
const sockets=require('./sockets');





router.get("/", (req, res) => {
    if (req.user) {
    res.sendFile(__dirname + "/public_static/index.html");
    
  } else {
    res.redirect("/login");
  }
});

router.post("/users", (req, res) => {
    userlist = controller.getUserList();
    // console.log(userlist);
    res.send(JSON.stringify(userlist));
  });

router.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public_static/login.html");
});

router.post("/user", (req, res)=>{

    res.send(JSON.stringify({username: req.user.username}));
   
})

router.post(
  "/login",
  auth.passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false
  })
);

router.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public_static/register.html");
});

router.post("/register", (req, res) => {
  // implement hashing

  
  username = req.body.username;
  password = req.body.password;
  //console.log(username +" "+ password)
  auth.createUser(username, password).then(()=>{
    res.redirect("/login");
  })
  //console.log(username);
   // implement auto log in
});

module.exports = router;
