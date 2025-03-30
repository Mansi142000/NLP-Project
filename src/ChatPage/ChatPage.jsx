import React from 'react';
import './ChatPage.css';
import Navbar from '../Navbar';
import Chatbot from "react-chatbot-kit";
import config from '../chatbot/config';
import MessageParser from '../chatbot/MessageParser';
import ActionProvider from '../chatbot/ActionProvider';
import 'react-chatbot-kit/build/main.css';

function ChatPage() {
  return (
    <div className="chat-page">
      <Navbar/>
      <div className="chatbot-container">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    </div>
  );
}

export default ChatPage;
