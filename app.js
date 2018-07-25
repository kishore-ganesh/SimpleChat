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
    console.log(userlist);
    res.send(JSON.stringify(userlist));
})

function sendInbox(socket, userdb)
{
    userdb.findAll().then((items)=>{
        
        //console.log(items[0].ravi);
        socket.emit('message', {items: items});
    });
}

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

        
        messagesdb.sync().then(()=>{

            messagesdb.findAll(
                {
                    where: {
        
                        from:{
                            [Op.or]:[from, to]
        
                        },
                        to: {
                            [Op.or]:[from, to]
                        }
        
                    }
        
                }    
                ).then((messages)=>{
        
                    console.log(messages);
                    resolve(messages);
                })
        })
        
    })
}

function emitMessage(username, message)
{
    usersockets=users[username];
    usersockets.forEach((user)=>{

        user.emit('message', message);
    })

}

function sendMessage(from, to, message)
{
    
    //console.log(usersockets);
    messageobj={items: [{
        from: from,
        to: to,
        messages: message}]}

    emitMessage(from, messageobj);
    emitMessage(to, messageobj);




    messagesdb.create({from: from, to: to, messages: message});


}

function getUserList()
{
    userlist=Object.keys(users);
    processedUserList=[];
    userlist.forEach((user)=>{

        if(users[user].length>=1)
        {
            processedUserList.push(user);
        }

    })
    return processedUserList;
    //make this more efficient
}


io.on('connection', (socket)=>{

    var username;
    var selectedUser;
    var userdb;

    io.emit('updatelist');
    
    socket.on('initialize', (data)=>{

        console.log('initializing');
       // socket.join(data.username);
        username=data.username;
        if(!users[username])
        {
            users[username]=[];
        }

        users[username].push(socket);
        //users.push(username);
        //console.log(username.toString());

        
        io.emit('updatelist');



        
    })

    socket.on('userSelected', (data)=>{

        selectedUser=data.selectedUser;
        returnMessages(username, selectedUser).then((messages)=>{
        
            
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
        if(users[username])
        {
            users[username].splice(0,1);
        }
        
        //users.splice(users.indexOf(username),1);
        io.emit('updatelist');
        
    })
})
server.listen(4000);

