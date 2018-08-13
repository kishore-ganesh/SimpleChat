const models=require('./models.js');
const controller=require('./controller.js')


var io;

function initializeSocket(server)
{
    io=require('socket.io')(server);
}


function startListening()
{
    
    io.on('connection', (socket)=>{
    
    onSocketConnection(socket)

})

}

function onSocketConnection(socket)
{
    {

        var username;
        var selectedUser;
        var userdb;
        //console.log(users);
    
        io.emit('updatelist');
        
        socket.on('initialize', (data)=>{
    
            console.log('initializing');
            socket.join(data.username);
            username=data.username;
            controller.addToUserList(username);
          ///  console.log(users);
            // console.log(users);
            //console.log(username.toString());
    
            userdb=models.defineModel(username);
            userdb.sync();
            io.emit('updatelist');
            // io.to(username).emit({
            //     items:[{from:"server", to: "client", messages: "initialized"}]
            // })
    
    
    
            
        })
    
        socket.on('userSelected', (data)=>{
    
            selectedUser=data.selectedUser;
            controller.returnMessages(selectedUser, username).then((messages)=>{
            
                
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
         
            
            controller.deleteFromUserList(username);
            io.emit('updatelist');
            
        })
    }
}


function sendMessage(from, to, message)
{
    
    //console.log(usersockets);
    messageobj={items: [{
        from: from,
        to: to,
        messages: message}]}

//    console.log(users.length);
   //console.log(from+" "+to);
   io.to(from).emit('message',messageobj);
   io.to(to).emit('message',messageobj);

   fromdb=models.defineModel(from);
   todb=models.defineModel(to);



//    controller.updateDB(messagesdb, from, to, message);
   controller.updateDB(fromdb, from, to, message);
   controller.updateDB(todb, from, to, message);

    


}
module.exports={initializeSocket, startListening}