function refreshUserList()
{
    $.post('/users', (JSONdata)=>{
        data=JSON.parse(JSONdata);
        $("#userlist").html("");
        dataset=new Set(data);
        dataset.forEach((user)=>{
            
            $("#userlist").append($("<li>").html(user));

        })
    })
}

window.onload=function()
{   
    var socket=io();

    $("#adduser").click(()=>
        {
          socket.emit('initialize', {username: $("#username").val()})
          refreshUserList();  
          $("#forSending").toggleClass("hidden");
          $("#registration").toggleClass("hidden");
        })
    $("#sendmessage").click(
        ()=>{
            socket.emit('send', {
                to: $("#to").val(),
                message: $("#message").val()
            })
        }
    )

    socket.on('message', (data)=>{

        items=data.items;
        console.log(data)
        console.log("recieved")
        items.forEach((item)=>{
            //console.log(item..message)
            $("#inbox").append($('<div>', {class: "messageitem"}).html("From: "+item.from+"<br>"+"To: "+item.to+"<br>"+item.messages));
        })
       

    })

  socket.on('updatelist', ()=>{

    refreshUserList();
  }) 
  
    




}