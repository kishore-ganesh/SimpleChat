const Sequelize = require("sequelize");
var sequelize;
if(process.env.DATABASE_URL)
{
   sequelize = new Sequelize(process.env.DATABASE_URL, 
{
 
  
  dialect: "postgres",
  protocol: "postgres",
  
 
  // SQLite only
 
});

}

else
{
   sequelize = new Sequelize('chat', 'simple', 'chat', 
  {
   
    // dialect: "postgres",
    dialect: "sqlite",
    storage:"database.sqlite"
   
    // SQLite only
   
  });
  
}

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

function defineGroup()
{
  return sequelize.define("groups", {
    groupname: {type: Sequelize.STRING, unique: true},
    members: Sequelize.STRING,
  })
}

function defineMessagesForGroup(name)
{
  return sequelize.define(name+"MES", {
    from:Sequelize.STRING,
    message: Sequelize.STRING
  })
}

users = [];

module.exports = { sequelize, defineModel, usermodel, users, defineGroup, defineMessagesForGroup };
