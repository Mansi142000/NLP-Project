import React from "react";
import './index.css'; // Import the CSS for styling
import './../../ChatPage.css';

function ChatDialogue({ dialog, index }) {
  if (dialog.role === 'system') return null; // Skip rendering

  const alignment = dialog.role === 'user' ? 'card-right' : 'card-left';

  // Set the card title based on the role
  const cardTitle = dialog.role === 'assistant' ? 'Cinebot' : 'User';

  return (
    <div className={`card ${alignment}`} key={index}>
      <div className="card-body">
        <h5 className="card-title">{cardTitle}</h5>
        <p className="card-text">{dialog.content}</p>
      </div>
    </div>
  );
}

export default ChatDialogue;
