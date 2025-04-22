import React, { useState } from 'react';
import './index.css';  // Assuming you have a separate CSS file for RightSidebar

function RightSidebar({ onModelChange }) {
  const [selectedModel, setSelectedModel] = useState('1'); 

  const handleModelChange = (event) => {
    const selected = event.target.value;
    setSelectedModel(selected);
    onModelChange(selected);
  };

  return (
    <div className="right-sidebar">
      <select value={selectedModel} onChange={handleModelChange} className="dropdown">
        <option value="1">Model 1 (multi-qa-MiniLM-L6-cos-v1)</option>
        <option value="2">Model 2 (all-MiniLM-L6-v2)</option>
        <option value="3">Model 3 (all-distilroberta-v1)</option>
        <option value="4">Model 4 (distilbert-base-nli-stsb-mean-tokens)</option>
        <option value="5">Model 5 (all-MiniLM-L12-v2)</option>
        <option value="6">chromaDB (all-MiniLM-L6-v2)</option>
      </select>
    </div>
  );
}

export default RightSidebar;
