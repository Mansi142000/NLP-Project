import React from "react";
import './index.css'; 
import './../index.css';
import ChatDialogue from './ChatDialogue'; 
import LoadingAnimation from './LoadingAnimation';
function ChatBox({ dialogList , isLoading, loadingMessage }) {

  return (

    <div className="chatbot-container">
    {dialogList.map((dialog, index) => (
      <ChatDialogue key={index} dialog={dialog} />   
    ))}
    <LoadingAnimation isLoading={isLoading} loadingMessage={loadingMessage} />
  </div>
  

  );
}

export default ChatBox;