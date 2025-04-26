import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './IntroPage.css'; 

const greeting = "Hi, I am CineBot";

function IntroPage() {
  const navigate = useNavigate(); 
  const greetingChars = Array.from(greeting);

  const animationVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.10 
      }
    })
  };

  // This function handles the button click event and navigates to the chat page
  // using the useNavigate hook from react-router-dom.
  const handleButtonClick = () => {
    navigate('/chatpage'); 
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
        <button type="button" className="btn btn-primary btn-lg" onClick={handleButtonClick}>Let's Chat!</button>
      </div>
    </div>
  );
}

export default IntroPage;
