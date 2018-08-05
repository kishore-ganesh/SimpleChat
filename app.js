const express=require('express');
const app=express();
const http=require('http');
const server=http.Server(app);
const models=require('./models.js');
const controller=require('./controller.js');
const sockets=require('./sockets.js');



sockets.initializeSocket(server);
sockets.startListening();
users=[];


app.use(express.static('public_static'))

app.post('/users', (req, res)=>{

    userlist=getUserList();
    // console.log(userlist);
    res.send(JSON.stringify(userlist));
})





function getUserList()
{
   // console.log(users.length);
    return users;
    //make this more efficient
}



server.listen(4000);

