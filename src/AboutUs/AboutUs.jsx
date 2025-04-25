import React from 'react';
import './AboutUs.css';
import Navbar from '../Navbar';

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="row aboutUs-page">
        <div className="col-2 left-border"></div>
        <div className="col-8 content">
          <h1 className='heading'>About Us</h1>
          <div className="profiles-container">
            <div className="profile-card">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv_hSQrI_I6t8oPgm5qw2DMmjGb90b17D-7g&s" 
                alt="Rohan Dalvi" 
                className="profile-img"
              />
              <h3>Rohan Rajendra Dalvi</h3>
              <p>He/Him</p>
              <p>QA Intern @ XanderGlasses</p>
              <p>CS Student @ Northeastern</p>
              <a href="https://rohandalvi.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
            </div>
            <div className="profile-card">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY4bp72Z8i5ZkbYFDMEQJ6_QTc6MeWEjwYlQ&s" 
                alt="Mansi Negi" 
                className="profile-img"
              />
              <h3>Mansi Negi</h3>
              <p>CAPM® | MIS Project Manager</p>
              <p>QA @ Bank of America</p>
              <p>MSCS @ Northeastern</p>
              <a href="https://portfolio-pm-one.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
            </div>
          </div>
        </div>
        <div className="col-2 right-border"></div>
      </div>
    </>
  );
}

export default AboutUs;
