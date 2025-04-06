import React, { useState } from 'react';
import './ChatPage.css';
import Navbar from '../Navbar';
import handleChromaQuery from '../services/choma_query_service';
import runGroqQuery from '../services/grok_query_script';
import ChatBox from './ChatBox'; // Import the ChatBox component
import SavedChats from './SavedChats';
import UserInput from './UserInput'; // Import the UserInput component

function ChatPage() {
  
  const default_start_of_chat = [
    { role: 'system', content: 'You are a helpful AI movie recommednation system.'},
    { role: 'assistant', content: 'Hello, What type of movie would you like to watch today?' }]; 

  const [dialogList, setDialogList] = useState(default_start_of_chat);
  const [userInput, setUserInput] = useState('');
  const [savedChats, setSavedChats] = useState([]);

  const addUserMsg = (content) => {
    if (content.trim()) {
      setDialogList(prev => [...prev, { role: 'user', content }]);
      setUserInput('');
    }
  };
  
  const addChatbotMsg = (content) => {
    setDialogList(prev => [...prev, { role: 'assistant', content}]);
  };

  const userMessageProcess = async (msg) => {
    const newUserMessage = { role: 'user', content: msg };
    const updatedDialogList = [...dialogList, newUserMessage];
    
    // Optimistically update UI
    setDialogList(updatedDialogList);
    setUserInput('');
  
    const recommended_movie = await handleChromaQuery(msg);
    const systemMessage = { role: 'system', content: 'recommend the user this movie' + JSON.stringify(recommended_movie) };
    const fullDialog = [...updatedDialogList, systemMessage];
  
    // Update state again for full context (optional)
    setDialogList(fullDialog);
  
    const promt_response = await runGroqQuery(fullDialog);
    addChatbotMsg(promt_response);
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
    setSavedChats([...savedChats, dialogList]);
    setDialogList(default_start_of_chat);
  };

  const loadChat = (chatIndex) => {
    setDialogList(savedChats[chatIndex]);
  };


  return (
    <div className="chat-page">
      <Navbar />
      <div className="row">
        <div className="col-2">
          <SavedChats savedChats={savedChats} loadChat={loadChat} handleNewChat={handleNewChat} />         
        </div>
        <div className="col-9">
          <ChatBox dialogList={dialogList} /> 
          {/* <button onClick={() => addChatbotMsg('Hello, I am Cinebot!')}>Add Chatbot Message</button> */}
          <UserInput
            userInput={userInput} 
            handleInputChange={handleInputChange} 
            handleKeyPress={handleKeyPress}
          />
        </div>
        <div className="col-1">
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
