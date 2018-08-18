function refreshUserList()
{
    return new Promise((resolve, reject)=>{

        $.post('/users', (JSONdata)=>{

            data=JSON.parse(JSONdata);
            $("#userlist").html("");
            dataset=new Set(data);
            dataset.forEach((user)=>{
                
                $("#userlist").append($("<li>", {class: "userlistitem"}).html(user));
    
            })

          //  console.log("reachedEnd");
            
            resolve();
    
            
        })
    })
    
}

function getAllUsers()
{
    return new Promise((resolve, reject)=>{

        $.post('/allusers', (JSONdata)=>{

            data=JSON.parse(JSONdata);
            $("#alluserslist").html("");
            dataset=new Set(data);

            dataset.forEach((user)=>{
                
                $("#alluserslist").append($("<li>", {class: "userlistitem"}).html(user));
    
            })

          //  console.log("reachedEnd");
            
            resolve();
    
            
        })
    })
    
}

window.onload=function()
{   
    var socket=io();
    var username;
    var selectedUser;

    $.post("/user", (JSONdata)=>{

        username=JSON.parse(JSONdata).username;
        console.log(username);
        if(username)
        {
            socket.emit('handshake', {
                username: username
            })
        }
    })

   

    

    $(".userslist").on('click', ".userlistitem", (e)=>{

        
                
            console.log("clicked")
            selectedUser=e.currentTarget.innerHTML;
            console.log(selectedUser);
            $("#inbox").html("");
            socket.emit('userSelected', {selectedUser: selectedUser});
            $("#forSending").removeClass("hidden");
            //fix this
        
    })

    function sendMessage()
    {
        socket.emit('send', {
            message: $("#message").val()
        })
    }

   
    $("#sendmessage").click(
      ()=> {sendMessage();}
    )

    $("#message").keypress((e)=>{
        if(e.which==13)
        {
            sendMessage();
        }
    });

    socket.on('message', (data)=>{

        console.log("recieved")
        //console.log(data);
        items=data.items;
        //console.log(data)
       
        items.forEach((item)=>{
            //console.log(item..message)
            var attr;

            //console.log(item.messages);
            
            if((item.from==selectedUser && item.to==username)|| (item.to==selectedUser&&item.from==username))
           {
               var from=item.from;
               if(item.from==username)
               {
                   from="Me";
               }
                $("#inbox").append($('<div>', {class:"messageitem"}).html("<h3>"+from+"</h3>"+item.messages));
            }
        })
       

    })

  socket.on('updatelist', ()=>{

    refreshUserList();
    getAllUsers();

  });
  
    




}