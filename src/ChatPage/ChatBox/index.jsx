import React from "react";
import './../ChatPage.css';
import ChatDialogue from './ChatDialogue'; // Import the ChatDialogue component if needed
function ChatBox({ dialogList }) {

  return (
    <div className="chatbot-container">
    {dialogList.map((dialog, index) => (
      <ChatDialogue key={index} dialog={dialog} />
    ))}
  </div>
  );
}

export default ChatBox;