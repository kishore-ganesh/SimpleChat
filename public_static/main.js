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

window.onload=function()
{   
    var socket=io();
    var username;
    var selectedUser;

    

    $("#adduser").click(()=>
        {
          username=$("#username").val();
          socket.emit('initialize', {username: username});
          $("#registration").toggleClass("hidden");
        })

    $("#userlist").on('click', ".userlistitem", (e)=>{

        
                
            console.log("clicked")
            selectedUser=e.currentTarget.innerHTML;
            console.log(selectedUser);
            socket.emit('userSelected', {selectedUser: selectedUser});
            $("#forSending").toggleClass("hidden");
            
        
    })

   
    $("#sendmessage").click(
        ()=>{
            socket.emit('send', {
                message: $("#message").val()
            })
        }
    )

    socket.on('message', (data)=>{

        console.log(data);
        items=data.items;
        console.log(data)
        console.log("recieved")
        items.forEach((item)=>{
            //console.log(item..message)
            var attr;
            
            $("#inbox").append($('<div>', {class:"messageitem"}).html("<h3>"+item.from+"</h3>"+item.messages));
        })
       

    })

  socket.on('updatelist', ()=>{

    refreshUserList();

  });
  
    




}