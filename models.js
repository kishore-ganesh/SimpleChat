const Sequelize=require('sequelize');
const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
  
  
    // SQLite only
    storage: 'database.sqlite'
  });


sequelize.authenticate().then(()=>{console.log("success")}).catch((err)=>{
   
    console.log(err);
}) 


function defineModel(name)
{
    return sequelize.define(name, {
        from: Sequelize.STRING,
        to: Sequelize.STRING,
        messages: Sequelize.STRING
    });
}