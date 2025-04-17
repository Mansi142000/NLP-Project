import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import Navbar from '../Navbar';
import handleChromaQuery from '../services/choma_query_service';
import runGroqQuery from '../services/grok_query_script';
import ChatBox from './ChatBox';
import SavedChats from './SavedChats';
import UserInput from './UserInput';

function ChatPage() {

  const default_start_of_chat = [
    { role: 'system', content: 'You are a helpful AI movie recommednation system.' },
    { role: 'assistant', content: 'Hello, What type of movie would you like to watch today?' }
  ];

  const [savedChats, setSavedChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [dialogList, setDialogList] = useState(default_start_of_chat);
  const [userInput, setUserInput] = useState('');

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

  const addUserMsg = (content) => {
    if (content.trim()) {
      const updatedDialog = [...dialogList, { role: 'user', content }];
      setDialogList(updatedDialog);
      updateCurrentChat(updatedDialog);
      setUserInput('');
    }
  };

  const addChatbotMsg = (content) => {
    const updatedDialog = [...dialogList, { role: 'assistant', content }];
    setDialogList(updatedDialog);
    updateCurrentChat(updatedDialog);
  };

  const userMessageProcess = async (userInput) => {
    // Step 1: Refine user input for vector search
    const promptRefinement = await runGroqQuery([
      {
        role: 'system',
        content: 'You will convert a user prompt into a refined query void of filler words and'+
        ' consisting only with keywords associated and adjecent to the given query suitable for '+
        'a vector database to retrieve the most relevant movie. Return only the improved query.',
      },
      { role: 'user', content: userInput },
    ]);
  
    const userMessage = { role: 'user', content: userInput };
    const updatedDialog = [...dialogList, userMessage];
  
    setDialogList(updatedDialog);
    updateCurrentChat(updatedDialog);
    setUserInput('');
  
    // Step 2: Query vector DB for the best movie match
    const recommendedMovie = await handleChromaQuery(promptRefinement);
  
    const recommendationMessage = {
      role: 'system',
      content: 'Recommend the user this movie: ' + JSON.stringify(recommendedMovie),
    };
  
    const dialogAfterRecommendation = [...updatedDialog, recommendationMessage];
  
    setDialogList(dialogAfterRecommendation);
    updateCurrentChat(dialogAfterRecommendation);
  
    // Step 3: Generate final assistant response
    const assistantReply = await runGroqQuery(dialogAfterRecommendation);
  
    const finalDialog = [
      ...dialogAfterRecommendation,
      { role: 'assistant', content: assistantReply },
    ];
  
    setDialogList(finalDialog);
    updateCurrentChat(finalDialog);
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
    const updatedChats = [...savedChats];
    if (dialogList.length > 2) {
      updatedChats[currentChatIndex] = dialogList;
    }
    const newChat = default_start_of_chat;
    updatedChats.push(newChat);
    setSavedChats(updatedChats);
    setDialogList(newChat);
    setCurrentChatIndex(updatedChats.length - 1);
  };

  const loadChat = (chatIndex) => {
    setCurrentChatIndex(chatIndex);
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
          <UserInput
            userInput={userInput}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
          />
        </div>
        <div className="col-1"></div>
      </div>
    </div>
  );
}

export default ChatPage;
