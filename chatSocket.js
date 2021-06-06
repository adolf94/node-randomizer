const makeid = (length) => {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}


let roomAdmins = {
  
}

const socketMiddleWare = (socket,io)=>{
  let userName = ""
  let room = ""

  socket.on("register", (data)=>{
    console.log("register: " + JSON.stringify(data))
    userName = data.name
    room = data.room
    console.log(socket.id)
    socket.emit("weeeelcome");
    socket.join(data.room)
    io.to(data.room).emit("welcome", data.name)
  })

  socket.on("send_message", (data)=>{
    console.log("received: " + JSON.stringify(data))
    if(room==="") return
    console.log(room)
    io.to(room).emit("new_message", {...data, type:"message", messageId: makeid(5)})
  })

  socket.on('roll_random', data=>{
    io.to(room).emit("perform_random", data)
    if(data.show)setTimeout(()=>{
      io.to(room).emit("declare_winner", {...data.winner, prize:data.prize, messageId: makeid(5) })
    }, 5500)
  })

  socket.on("admin_login", (data)=>{
    roomAdmins[data.room] = socket.id
  })

  socket.on("request_winners", ()=>{
    io.to(roomAdmins[room]).emit("request_winners", {id:socket.id})
  })


  socket.on("show_winners", (data)=>{
    io.to(data.to).emit("show_winners", data.winners)
  })
  socket.on("show_winners_all", (data)=>{
    io.to(room).emit("show_winners", data.winners)
  })
}

module.exports = socketMiddleWare;

 