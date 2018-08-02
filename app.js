const express=require('express');
const app=express();
const http=require('http');
const server=http.Server(app);
const io=require('socket.io')(server);
const Sequelize=require('sequelize');
const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
  
  
    // SQLite only
    storage: 'database.sqlite'
  });

const Op=sequelize.Op;
const models=require('./models.js');


// const sequelize=new Sequelize('database', {
//     dialect: 'sqlite',
//     storage: './messages.sqlite'
// })

sequelize.authenticate().then(()=>{console.log("success")}).catch((err)=>{
   
    console.log(err);
})

users=[];


app.use(express.static('public_static'))

app.post('/users', (req, res)=>{

    userlist=getUserList();
    // console.log(userlist);
    res.send(JSON.stringify(userlist));
})



function defineModel(name)
{
    return sequelize.define(name, {
        from: Sequelize.STRING,
        to: Sequelize.STRING,
        messages: Sequelize.STRING
    });
}


var messagesdb=defineModel("messagesdb");
function returnMessages(from, to)
{   
    return new Promise((resolve, reject)=>{

        todb=defineModel(to);
        todb.sync().then(()=>{

            todb.findAll(
                {
                    where: {
        
                      [Op.or] : {from:from,
                             to: from} //All messages from from and to from
                    }
        
                }    
                ).then((messages)=>{
        
                     console.log(messages);
                    resolve(messages);
                })
        })
        
    })
}



function sendMessage(from, to, message)
{
    
    //console.log(usersockets);
    messageobj={items: [{
        from: from,
        to: to,
        messages: message}]}

//    console.log(users.length);
   console.log(from+" "+to);
   io.to(from).emit('message',messageobj);
   io.to(to).emit('message',messageobj);

   fromdb=defineModel(from);
   todb=defineModel(to);



//    updateDB(messagesdb, from, to, message);
   updateDB(fromdb, from, to, message);
   updateDB(todb, from, to, message);

    


}

function updateDB(db, from, to, message)
{
    db.create({from: from, to: to, messages: message});
}

function getUserList()
{
    return users;
    //make this more efficient
}


io.on('connection', (socket)=>{

    var username;
    var selectedUser;
    var userdb;

    io.emit('updatelist');
    
    socket.on('initialize', (data)=>{

        console.log('initializing');
        socket.join(data.username);
        username=data.username;
       
        users.push(username);
        // console.log(users);
        //console.log(username.toString());

        userdb=defineModel(username);
        userdb.sync();
        io.emit('updatelist');
        // io.to(username).emit({
        //     items:[{from:"server", to: "client", messages: "initialized"}]
        // })



        
    })

    socket.on('userSelected', (data)=>{

        selectedUser=data.selectedUser;
        returnMessages(selectedUser, username).then((messages)=>{
        
            
            socket.emit('message', {items:messages});
        }
    
    );

    })

    socket.on('send', (data)=>{
        console.log("sending")
      //  to=data.to;
       
        sendMessage(username, selectedUser, data.message);
    })

    socket.on('disconnect', ()=>{

        console.log("Disconnecting from room")
        //socket.leave(username);
      //  console.log(users[username]);
     
        
        users.splice(users.indexOf(username),1);
        io.emit('updatelist');
        
    })
})
server.listen(4000);

