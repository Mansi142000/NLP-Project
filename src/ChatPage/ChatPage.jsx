import React, { useState } from 'react';
import './ChatPage.css';
import Navbar from '../Navbar';

function ChatPage() {
  const [dialogList, setDialogList] = useState([]);

  const addChatbotMsg = (msg) => {
    setDialogList([...dialogList, { user: 'Cinebot', msg, alignment: 'left' }]);
  };

  const addUserMsg = (msg) => {
    setDialogList([...dialogList, { user: 'User', msg, alignment: 'right' }]);
  };

  return (
    <div className="chat-page">
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-1">
          </div>
          <div className="col-10">
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
              <button onClick={() => addUserMsg('Hi Cinebot, I am Ronumau')}>Add User Message</button>
            </div>
          </div>
          <div className="col-1">
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
