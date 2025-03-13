import React from 'react';
import { motion } from 'framer-motion';
import splitStringUsingRegex from './splitStringUsingRegex';
import './IntroPage.css'; 

const greeting = "Hi, I am CineBot";

function IntroPage() {
  const greetingChars = splitStringUsingRegex(greeting);

  const animationVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.10 // Delays each letter reveal
      }
    })
  };

  return (
    <div className="page-container"> 
      <div className="content-center"> 
        <div className="heading">
          <motion.h1 className="greeting"> 
            {greetingChars.map((char, index) => (
              <motion.span
                key={index}
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>
        <div className="button">
            <button type="button" class="btn btn-primary btn-lg">Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
