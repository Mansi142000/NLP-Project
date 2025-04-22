import React, { useState, useEffect } from 'react';
import './index.css';
import Navbar from '../Navbar';
import handleChromaQuery from '../services/choma_query_service';
import handleAdvancedQuerySearch from '../services/faiss_advanced_query1';
import runGroqQuery from '../services/grok_query_script';
import ChatBox from './ChatBox';
import SavedChats from './SavedChats';
import UserInput from './UserInput';
import RightSidebar from './RightSidebar'; // Import RightSidebar

function ChatPage() {
  const default_start_of_chat = [
    { role: 'assistant', content: 'Hello, What type of movie would you like to watch today?' }
  ];

  const [savedChats, setSavedChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [dialogList, setDialogList] = useState(default_start_of_chat);
  const [userInput, setUserInput] = useState('');
  const [modelChoice, setModelChoice] = useState('1'); // Store selected model choice
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  useEffect(() => {
    // On first load, initialize the first chat
    if (savedChats.length === 0) {
      setSavedChats([default_start_of_chat]);
      setCurrentChatIndex(0);
    }
  }, []);

  const updateCurrentChat = (newDialogList) => {
    const updatedChats = [...savedChats];
    updatedChats[currentChatIndex] = newDialogList;
    setSavedChats(updatedChats);
  };

  const userMessageProcess = async (userInput) => {
    // Add your message processing code here
  };

  const handleModelChange = (modelChoice) => {
    setModelChoice(modelChoice); // Update selected model choice
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      userMessageProcess(userInput);
    }
  };

  const handleNewChat = () => {
    // Handle new chat here
  };

  const loadChat = (chatIndex) => {
    setCurrentChatIndex(chatIndex);
    setDialogList(savedChats[chatIndex]);
  };

  return (
    <div className="chat-page">
      <Navbar />
      <div className='row'>
        <div className="col-2">
          <div className="toprow">
            <h3>Saved Chats</h3>
          </div>
          <div className="saved-chats-section">
            <SavedChats savedChats={savedChats} loadChat={loadChat} handleNewChat={handleNewChat} />
          </div>
        </div>
        <div className="col-7">
          <div className="chatbox-section">
            <ChatBox dialogList={dialogList} loadingMessage={loadingMessage} isLoading={isLoading} />
            <UserInput
              userInput={userInput}
              handleInputChange={handleInputChange}
              handleKeyPress={handleKeyPress}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="toprow">
            <h3>Select Model</h3>
          </div>
          <div className="model-selection-section">
            <RightSidebar onModelChange={handleModelChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
