import React from "react";

import './index.css';
import './../ChatPage.css';

function SavedChats({ savedChats, loadChat, handleNewChat }) {
    return(
        <div>
            <h3 className="saved-heading">Saved Chats</h3>
            <button onClick={handleNewChat} className="new-chat-btn">New Chat</button>
            {savedChats.map((chat, index) => (
                <button key={index} onClick={() => loadChat(index)} className="saved-chat-btn">
                    Chat {index + 1}
                    </button>
            ))}
            
        </div>
    );
}

export default SavedChats;