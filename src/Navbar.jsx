import React from 'react';
import { Link } from 'react-router-dom';
import favicon from './assets/favicon.png';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        <img src={favicon} alt="CineBot Logo" style={{ marginRight: 5 }} height="30" />  
        CineBot
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/documentation">Documentation</Link>
          <Link className="nav-item nav-link" to="/about">About Us</Link>
          <Link className="nav-item nav-link" to="/chatpage">Chatbot</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
