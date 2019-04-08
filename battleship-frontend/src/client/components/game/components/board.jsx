/**
 *
 */
import React, { Component } from 'react';

import Cell from './cell';
import './board.scss';

class Board extends Component {
  onClickCell = (cell) => {
    if (this.props.onClickCell) {
      this.props.onClickCell({ to: this.props.playerId, ...cell })
    }
  };

  shouldMarkCol(col) {
    return col === 1;
  }

  shouldMarkRow(row) {
    return row === 1;
  }

  buildCol() {
    return Array(this.props.config.height).fill();
  }

  makeRow() {
    return Array(this.props.config.width).fill();
  }

  render() {
    const self = this;
    const { shots, fleet } = self.props;

    const boardFleet = fleet ? Array.from(fleet) : [];

    return (
      <div className={`game-board ${self.props.className}`}>
        <table className="game-board__container">
          <tbody>
          {self.buildCol().map((_, colIndex) => {
            const col = colIndex + 1;

            const rows = self.makeRow().map((_, rowIndex) => {
              const row = rowIndex + 1;
              const cellProps = { coordinates: { coordinateY: col, coordinateX: row }};

              if (self.shouldMarkCol(col)) {
                cellProps.markerCol = String.fromCharCode(65 + rowIndex);
              }

              if (self.shouldMarkRow(row)) {
                cellProps.markerRow = col;
              }

              if (boardFleet && boardFleet.length) {
                const shipPlace = boardFleet.find(({ placement: { coordinateY, coordinateX }}) => coordinateY === col && coordinateX === row );

                if (shipPlace) {
                  cellProps.ship = shipPlace;
                }
              }

              if (shots && shots.length) {
                const shotList = shots.receivedShots || shots;
                const shotPlace = shotList.find(({ placement: { coordinateY, coordinateX }}) => coordinateY === col && coordinateX === row );

                if (shotPlace) {
                  cellProps.fire = shotPlace;
                }
              }

              return <Cell key={`${col}_${row}`} {...cellProps} onClick={self.onClickCell} />
            });

            return <tr key={col}>{rows}</tr>
          })}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Board;
