/**
 * Game model.
 * Contains all the game logic to be used in resolvers.
 */
const GAME_STATUS = {
  WAITING_FOR_OPPONENT: 'waiting_for_opponent',
  DELETE: 'delete',
  SHOT: 'shot',
};

class Game {
  constructor({ userId, game }) {
    this.userId = userId;
    this.game = game;
    this.id = game.id;
  }

  get fleetConfig() {
    return this.game.mod.fleet;
  }

  get board() {
    return this.game.mod.board;
  }

  get title() {
    return this.game.title;
  }

  get status() {
    return this.game.status;
  }

  get fleet() {
    return this.player.fleet;
  }

  get opponents() {
    return this.game.players.filter(p => p.id !== this.player.id);
  }

  get shotHistory() {
    return this.game.shotHistory;
  }

  userHaveNoActions() {
    return this.player.availableActions.length === 0;
  }

  userCanDelete() {
    return this.player.availableActions.indexOf(GAME_STATUS.DELETE) !== -1;
  }

  userCanPlay() {
    return this.player.availableActions.indexOf(GAME_STATUS.SHOT) !== -1;
  }

  receivedShots() {
    const playerId = this.player.id;
    return [];
  }

  compareGame(game) {
    if (this.userHaveNoActions() && !game.userHaveNoActions()) {
      return 1;
    }
    else if (this.userCanDelete() && !game.userCanDelete()) {
      return 1;
    } else if (this.userCanPlay() && !game.userCanPlay()) {
      return -1;
    }

    return 0;
  }

  /**
   * The current player.
   */
  get player() {
    if (!this._player) {
      this._player = this.game.players.find((p) => p.user === this.userId);
    }

    return this._player
  }

  isWaitingForOpponent() {
    return this.game.status === GAME_STATUS.WAITING_FOR_OPPONENT;
  }
}

export default Game;
