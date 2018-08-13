const passport = require("passport");
const controller = require("./controller.js");
const models = require("./models.js");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy((username, password, done) => {
    controller.findUserinDB(username).then(user => {
      
      if (user.length == 0) {
        return done(null, false, { message: "Wrong username" });
      } else if (user[0].password != password) {
        return done(null, false, { message: "Wrong password" });
      }

      return done(null, user[0]);
    });

    //find in DB, and return done(null, user) if true
    //done(null, false, {}) if false
    //done(err) if error
    //ensure that only one user in DB
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(id)
    controller.findUserbyID(id).then(user => {
    done(null, user);
  });
});

module.exports = { passport };
