import './App.css';
import io from 'socket.io-client'
import {useState} from 'react';
import Chat from './Chat';

const socket = io.connect("https://chaton-abhinav.herokuapp.com");

function App() {

  const [username , setUsername] = useState("");
  const [room , setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  


  const joinRoom = () => {
    if(username !== "" && room !== ""){
      const obj ={room:room,username:username};
      socket.emit("join_room",obj); 
      setShowChat(true);
    }
  };
  return (
    <div className="App">
        { !showChat ? (
      <div className='joinChatContainer'>
            <h3><strong>CHATON</strong></h3>
          <input type = "text" placeholder = "NAME.." onChange={(event) =>{
            setUsername(event.target.value);
          }}
          />
          <input type = "text" placeholder = "ROOM ID.." onChange={(event) =>{
            setRoom(event.target.value);
          }}
          onKeyPress={(event) => {event.key === "Enter" && joinRoom();}}
          />
          
          <button onClick = {joinRoom}>Join Room</button>
      </div>
        ) : (
       <Chat socket = {socket} username = {username} room ={room}/>
       )}
    </div>
  );
}

export default App;
