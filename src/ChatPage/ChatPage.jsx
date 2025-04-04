import React, { useState } from 'react';
import './ChatPage.css';
import Navbar from '../Navbar';

function ChatPage() {
  const [dialogList, setDialogList] = useState([{ user: 'Cinebot', msg: 'Hello, What type of movie would you like to watch today?', alignment: 'left' }]);
  const [userInput, setUserInput] = useState('');
  const [savedChats, setSavedChats] = useState([]);

  const addChatbotMsg = (msg) => {
    setDialogList([...dialogList, { user: 'Cinebot', msg, alignment: 'left' }]);
  };

  const addUserMsg = (msg) => {
    if (msg.trim()) {
      setDialogList([...dialogList, { user: 'User', msg, alignment: 'right' }]);
      setUserInput(''); 
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addUserMsg(userInput);
    }
  };

  const handleNewChat = () => {
    setSavedChats([...savedChats, dialogList]);
    setDialogList([{ user: 'Cinebot', msg: 'Hello, What type of movie would you like to watch today?', alignment: 'left' }]);
  };

  const loadChat = (chatIndex) => {
    setDialogList(savedChats[chatIndex]);
  };

  return (
    <div className="chat-page">
      <Navbar />
      <div className="row">
        <div className="col-2">
          {savedChats.map((chat, index) => (
            <button key={index} onClick={() => loadChat(index)} className="saved-chat-btn">
              Chat {index + 1}
            </button>
          ))}
          <button onClick={handleNewChat} className="new-chat-btn">New Chat</button>
        </div>
        <div className="col-9">
          <div className="chatbot-container">
            {dialogList.map((dialog, index) => (
              <div className={`card ${dialog.alignment === 'left' ? 'card-left' : 'card-right'}`} key={index}>
                <div className="card-body">
                  <h5 className="card-title">{dialog.user}</h5>
                  <p className="card-text">{dialog.msg}</p>
                </div>
              </div>
            ))}
            <button onClick={() => addChatbotMsg('Hello, I am Cinebot!')}>Add Chatbot Message</button>
            <div className="user-input-container">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
              />
              <button onClick={() => addUserMsg(userInput)}>Send</button>
            </div>
          </div>
        </div>
        <div className="col-1">
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
