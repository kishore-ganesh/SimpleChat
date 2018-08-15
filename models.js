const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  host: "localhost",
  dialect: "sqlite",
  operatorsAliases: false,

  // SQLite only
  storage: "database.sqlite"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("success");
  })
  .catch(err => {
    console.log(err);
  });

var usermodel = sequelize.define("users", {
  username: {type: Sequelize.STRING, unique: true},
  password: Sequelize.STRING
});

function defineModel(name) {
  return sequelize.define(name, {
    from: Sequelize.STRING,
    to: Sequelize.STRING,
    messages: Sequelize.STRING
  });
}

users = [];

module.exports = { sequelize, defineModel, usermodel, users };
