import React from 'react';

import './board-mark.scss';

const BoardMark = ({ mark, direction }) => (
  <div className={`board-mark board-mark__${direction}`}>{mark}</div>
);

export default BoardMark;
