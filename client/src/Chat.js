import React, { useEffect, useState } from "react";
import './App.css'
import ReactEmoji from 'react-emoji';
import ScrollToBottom from  'react-scroll-to-bottom'

function Chat({socket , username , room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
      if(currentMessage !== ""){
         const messageData = {
          id:socket.id,
          room: room,
          username : username,
          message : currentMessage,
          time: (new Date(Date.now()).getHours()<10?("0"+ new Date(Date.now()).getHours()):(new Date(Date.now()).getHours()))+ ":" + (new Date(Date.now()).getMinutes()<10? "0"+new Date(Date.now()).getMinutes():new Date(Date.now()).getMinutes()),
         };

  
         await socket.emit("send_message",messageData);
         setMessageList((list) => [...list, messageData]);
         setCurrentMessage("");
         
      }
    };

    useEffect(() =>{
      socket.on("receive_message",(data)=>{
          setMessageList((list) => [...list, data]);
      })
    },[socket]);
  return (
    <div className="chat-window">
      <div className='chat-header'>
        <p><strong>CHATON</strong></p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className="message-container">
        {messageList.map((messageContent) => {
          return <div className="message" id={username === messageContent.username ? "you" : "other"}>
            <div>
             <div className="message-content">
              <p>{ReactEmoji.emojify(messageContent.message)}</p>
             </div>
             <div className="message-meta">
              <p id = "time">{messageContent.time}&#160;</p>
              <p id ="author">{messageContent.username}</p>
             </div>
            </div>
          </div>;
        })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input type="text"  value={currentMessage} placeholder = "Message..." onChange={(event) =>{
              setCurrentMessage(event.target.value);
           }}
           onKeyPress={(event) => {event.key === "Enter" && sendMessage();}}
        />
        <button onClick = {sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
