/**
 * Cell component.
 */
import React from 'react';

import Ship from './ship';
import BoardMark from './board-mark';
import FireMark from './fire-mark';

import './cell.scss';


const BoardCell = ({ ship, markerRow, markerCol, fire, coordinates, onClick }) => {
  return (
    <td className={`board-cell`} onClick={() => !fire && onClick(coordinates)}>
      { ship && <Ship {...ship} /> }
      {fire && <FireMark {...fire}/>}
      { markerRow && <BoardMark mark={markerRow} direction="row" /> }
      { markerCol && <BoardMark mark={markerCol} direction="col" /> }
    </td>
  );
};

export default BoardCell;
