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

    res.send(JSON.stringify(users));
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
io.on('connection', (socket)=>{

    var username;
    var userdb;

    
    socket.on('initialize', (data)=>{

        console.log('initializing');
        socket.join(data.username);
        username=data.username;
        users.push(username);
        //console.log(username.toString());

        userdb=defineModel(username);

        userdb.sync().then()
        {
            sendInbox(socket, userdb);

        };
        io.emit('updatelist');


        
    })

    socket.on('send', (data)=>{
        console.log("sending")
        to=data.to;
        messageobj={
            from: username,
            to: to,
            messages: data.message}
        payload= {
                
            items: [messageobj]
        };
        io.to(to).emit('message', 
           payload
        );
        io.to(username).emit('message', payload);
        toUserDB=defineModel(to);
        toUserDB.sync().then(()=>{

            toUserDB.create(messageobj);
            userdb.create(messageobj);
        })

        

    })

    socket.on('disconnect', ()=>{

        console.log("Disconnecting from room")
        socket.leave(username);
        users.splice(users.indexOf(username),1);
        io.emit('updatelist');
        
    })
})
server.listen(4000);

