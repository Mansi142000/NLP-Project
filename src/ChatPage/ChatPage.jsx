import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import Navbar from '../Navbar';
import handleChromaQuery from '../services/choma_query_service';
import handleAdvancedQuerySearch from '../services/faiss_advanced_query1';
import runGroqQuery from '../services/grok_query_script';
import ChatBox from './ChatBox';
import SavedChats from './SavedChats';
import UserInput from './UserInput';

function ChatPage() {

  const default_start_of_chat = [
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


  const extractJsonFromText = (text) => {
    const match = text.match(/\{[\s\S]*\}/); // Match the first {...} block including newlines
    if (!match) return text;
    try {
      return match[0];
    } catch (e) {
      console.warn('JSON parse error:', e);
      return null;
    }
  };

  const userMessageProcess = async (userInput) => {
    try {
      console.log('User input:', userInput);

      // Add new user message to the dialog history (used in LLM context)
      const updatedDialog = [...dialogList, { role: 'user', content: userInput }];

      // Step 1: Use LLM to generate a refined query object with filters (using full context)
      const queryDialog = [
        {
          role: 'system',
          content:
            'You are an assistant that takes a movie-related user prompt and extracts:\n' +
            '1. A positive_query: A string describing what the user wants (please feel free to embellish the query with cast and themes, but do not mention any actual movie and do not leave empty).\n' +
            '2. A negative_query: A string describing actors or themes the user wants to avoid.\n' +
            '3. A row_checker object that may include any of the following optional filters - be conservative with the restrictions:\n' +
            '   - min_year (integer)\n' +
            '   - max_year (integer)\n' +
            '   - min_rating (float)\n' +
            '   - max_rating (float)\n' +
            '   - min_duration (integer, in minutes)\n' +
            '   - max_duration (integer, in minutes)\n' +
            '   - required_genres (list of strings)\n' +
            '   - excluded_genres (list of strings)\n' +
            '   - required_languages (list of strings)\n' +
            '   - excluded_languages (list of strings)\n' +
            'If the prompt is asking for movie recommendation return ONLY a valid JSON object with keys: positive_query, negative_query, row_checker.\n' +
            'Else ask the user to rephrase the question.',
        },
        ...updatedDialog,
      ];

      const promptForQueryParams = await runGroqQuery(queryDialog);
      console.log('Prompt for query params:', promptForQueryParams);

      // Extract JSON from response
      const cleanJson = extractJsonFromText(promptForQueryParams);

      let queryParams;
      try {
        queryParams = JSON.parse(cleanJson);
      } catch (parseError) {
        console.warn('Could not parse query params JSON. Probably not a recommendation query.');
        const assistantReply = {
          role: 'assistant',
          content:
            cleanJson || 'Sorry, I couldn’t understand your request. Can you rephrase it as a movie recommendation?',
        };
        const fallbackDialog = [...updatedDialog, assistantReply];
        setDialogList(fallbackDialog);
        updateCurrentChat(fallbackDialog);
        setUserInput('');
        return;
      }

      // Save dialog update with user input
      setDialogList(updatedDialog);
      updateCurrentChat(updatedDialog);
      setUserInput('');

      // Step 2: Run vector search with the generated parameters
      const searchResponse = await handleAdvancedQuerySearch({
        ...queryParams,
        top_k: 10,
      });

      console.log('Search response:', searchResponse);
      const movieCandidates = searchResponse?.results || [];

      // Step 3: Ask the LLM to pick the most suitable movies from the list (with full context)
      const refineDialog = [
        {
          role: 'system',
          content:
            'You are a movie assistant. Based on the user\'s original prompt, evaluate the following list of movie candidates and suggest the most suitable ones ranked by relevance.\n' +
            'Respond with a list of up to 3 recommended titles, with short justification for each, generate the response utilzaing markdown, insert links images and information as needed.',
        },
        ...updatedDialog,
        {
          role: 'system',
          content: 'Here are the candidate movies: ' + JSON.stringify(movieCandidates),
        },
      ];

      const promptToRefineSelection = await runGroqQuery(refineDialog);

      // Step 4: Display final assistant reply
      const finalDialog = [
        ...updatedDialog,
        { role: 'assistant', content: promptToRefineSelection },
      ];
      setDialogList(finalDialog);
      updateCurrentChat(finalDialog);
    } catch (error) {
      console.error('Error in userMessageProcess:', error);
    }
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
