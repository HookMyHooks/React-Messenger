import React from 'react';
import './HomePage.css';
import SoundPlayer from '../sound-component/SoundPlayer';

const Home = () => {
  return (
    <div className='HomePageSetup'>
      <h2>Home</h2>
      <p>Hello!</p>
      This is a simple messenger app with a few custom components made with react. 

      <SoundPlayer>
        Yeet
      </SoundPlayer>
    </div>
  );
};

export default Home;
