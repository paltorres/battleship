/**
 *
 */
import React, { useState, useEffect } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


const Home = ({ }) => {
  const [content, setContent] = useState(0);

  return (
    <div className="">
      <Tabs defaultActiveKey="myGames">
        <Tab eventKey="myGames" title="My Games">
          <div>My game list</div>
        </Tab>
        <Tab eventKey="gamePool" title="Game Pool">
          <div>The game pool</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Home;
