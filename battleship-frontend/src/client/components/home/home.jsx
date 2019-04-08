/**
 *
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import MyGames from './components/my-games';
import GamePool from './components/game-pool';


const Home = ({ }) => {
  const [content, setContent] = useState('myGames');
  return (
    <div className="">
      <Tabs defaultActiveKey="myGames" activeKey={content} onSelect={key => setContent(key)}>
        <Tab eventKey="myGames" title="My Games">
          {content === 'myGames' && <MyGames />}
        </Tab>

        <Tab eventKey="gamePool" title="Game Pool">
          {content === 'gamePool' && <GamePool />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Home;
