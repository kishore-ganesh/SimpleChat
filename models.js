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
   
    dialect: "postgres",
   
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

users = [];

module.exports = { sequelize, defineModel, usermodel, users };
